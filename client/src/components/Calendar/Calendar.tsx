import { Event } from '@/features/Events/Event';
import en from '@/locale/en';
import es from '@/locale/es';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Calendar, View, momentLocalizer } from 'react-big-calendar';
import 'moment/locale/es';
import CalendarButton from '@/components/Button/CalendarButton';
import EventHandicap from '@/features/Events/EventHandicap';
import CustomWeekView from './CustomWeekView';

type CalendarProps = {
	events: Event[];
	onShowMore: (events: Event[], date: Date) => void;
	onSelectEvent: (event: Event) => void;
	onNavigate: (date: Date, view: 'month' | 'day' | 'week') => void;
	view: 'month' | 'day' | 'week';
	date: Date;
};

const MyCalendar: React.FC<CalendarProps> = ({
	events,
	onShowMore,
	onSelectEvent,
	onNavigate,
	view,
	date,
}) => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;

	const localizer = momentLocalizer(moment);
	useEffect(() => {
		moment.locale(locale);
	}, [locale]);

	useEffect(() => {
		setCurrentView(view);
		setCurrentDate(date);
	}, [view, date]);

	const [currentDate, setCurrentDate] = useState(new Date());
	const [currentView, setCurrentView] = useState<'month' | 'day' | 'week'>(
		view
	);

	const handleViewChange = (newView: 'month' | 'day' | 'week', date: Date) => {
		setCurrentView(newView);
		onNavigate(date, newView);
	};

	const handleNextMonth = () => {
		const nextMonth = moment(currentDate).add(1, currentView).toDate();
		setCurrentDate(nextMonth);
		onNavigate(nextMonth, currentView);
	};

	const handlePrevMonth = () => {
		const prevMonth = moment(currentDate).add(-1, currentView).toDate();
		setCurrentDate(prevMonth);
		onNavigate(prevMonth, currentView);
	};

	function mapEvents(someEvents: Event[]) {
		const mapedEvents = [];

		for (const event of someEvents) {
			const startDate = new Date(event.startDate);

			const endDate = event.endDate
				? new Date(event.endDate)
				: new Date(event.startDate);

			if (
				endDate.getHours() == 0 &&
				endDate.getMinutes() == 0 &&
				(currentView === 'day' || currentView === 'week')
			) {
				endDate.setMinutes(endDate.getMinutes() - 1);
			}

			/* if (startDate.getHours() == 0 && startDate.getMinutes() == 0) {
				startDate.setMilliseconds(1);
			} */

			mapedEvents.push({
				id: event.id,
				title: event.name,
				start: startDate,
				end: endDate,
			});
		}

		return mapedEvents;
	}

	const views = {
		month: true,
		day: true,
		week: CustomWeekView,
	};

	const label =
		currentView === 'month'
			? t[`${currentView}${currentDate.getMonth().toString()}`]
			: t[`day${new Date(currentDate).getUTCDay().toString()}`] +
			  ` ${new Date(currentDate).getDate().toString()} `;
	return (
		<div>
			<CalendarButton
				currentView={currentView}
				onPrev={() => handlePrevMonth()}
				onNext={() => handleNextMonth()}
				onMonth={() => {
					handleViewChange('month', new Date());
					setCurrentDate(new Date());
				}}
				monthLabel={t['monthly']}
				onDay={() => {
					handleViewChange('day', new Date());
					setCurrentDate(new Date());
				}}
				dayLabel={t['daily']}
				onWeek={() => {
					handleViewChange('week', new Date());
					setCurrentDate(new Date());
				}}
				weekLabel={t['weekly']}
				label={label}
				year={currentDate.getFullYear()}
			/>
			<Calendar
				showMultiDayTimes={true}
				eventPropGetter={(event) => {
					const actualDate = new Date();
					actualDate.setMinutes(actualDate.getMinutes() - EventHandicap);
					const isPast = actualDate > new Date(event.start);
					const newStyle = {
						color: '#ffffff',
						backgroundColor: '#984d98',
						fontSize: '12px',
						borderColor: '#873c87',
					};

					if (isPast) {
						newStyle.backgroundColor = 'gray';
						newStyle.borderColor = 'darkslategrey';
					}

					return {
						style: newStyle,
					};
				}}
				date={currentDate}
				localizer={localizer}
				messages={{
					next: t['next'],
					previous: t['previous'],
					today: t['today'],
					showMore: function showMore(total) {
						return '+' + total + ` ${t['more']}`;
					},
				}}
				events={mapEvents(events)}
				startAccessor='start'
				endAccessor='end'
				style={{
					height: 400,
					minWidth: '100%',
				}}
				onNavigate={(date) => onNavigate(date, currentView)}
				onShowMore={(dayEvents, date) =>
					onShowMore(
						dayEvents.map((event) =>
							events.find((e) => e.id === event.id)
						) as Event[],
						date
					)
				}
				min={moment(new Date()).startOf('day').toDate()}
				max={moment(new Date()).endOf('week').add(1, 'day').toDate()}
				length={20}
				onSelectEvent={(event) =>
					onSelectEvent(events.find((e) => e.id === event.id) as Event)
				}
				components={{
					toolbar: () => null,
				}}
				defaultDate={currentDate}
				views={views}
				view={currentView as View}
			/>
		</div>
	);
};

export default MyCalendar;
