import MyCalendar from '@/components/Calendar/Calendar';
import MyCard from '@/components/Card/Card';
import HomeDrawer from '@/components/Drawer/HomeDrawer';
import Title from '@/components/Title/Title';
import { Event } from '@/features/Events/Event';
import EventHandicap from '@/features/Events/EventHandicap';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import useEventList from '@/hooks/useEventList';
import useMyUser from '@/hooks/useMyUser';
import en from '@/locale/en';
import es from '@/locale/es';
import { Typography } from '@mui/material';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const MyAgenda = () => {
	const [isDrawerOpened, setIsDrawerOpened] = useState(false);
	const [drawerEvents /* setDrawerEvents */] = useState<Event[]>([]);
	const [drawerDay, setDrawerDay] = useState<Date>(new Date());
	const [monthEvents, setMonthEvents] = useState<Event[]>([]);
	const { myUser, setMyUser } = useMyUser();
	const [focusedDate, setFocusedDate] = useState<Date>(new Date());
	const [currentView, setCurrentView] = useState<'month' | 'day' | 'week'>(
		'month'
	);
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { setEventList } = useEventList();
	const { data: session } = useSession();

	useEffect(() => {
		const date = focusedDate ? focusedDate : new Date();
		const actualDate = new Date();
		actualDate.setMinutes(actualDate.getMinutes() - EventHandicap);

		const someEvents = filterEventsByDate(
			myUser?.favoriteEvents,
			date,
			currentView
		);
		setMonthEvents(someEvents as Event[]);
	}, [myUser]);

	const getUser = async () => {
		if (session?.user?.email) {
			const response = await getuserByEmail(session?.user?.email);
			if (response.data) {
				setMyUser(response.data);
			}
		}
	};

	useEffect(() => {
		getUser();
	}, [session]);

	const handleCardClick = (event: Event) => {
		setEventList(monthEvents);
		router.push(
			`/events/detail/${event.id}
			`
		);
	};

	const handleShowMore = (date: Date) => {
		setCurrentView('day');
		setDrawerDay(new Date(date));
		handleNavigate(new Date(date), 'day');

		/* setDrawerDay(date);
		setDrawerEvents(events);
		setIsDrawerOpened(!isDrawerOpened); */
	};

	const handleNavigate = (date: Date, view: 'month' | 'day' | 'week') => {
		setFocusedDate(date);
		setCurrentView(view);
		const someEvents = filterEventsByDate(myUser?.favoriteEvents, date, view);
		setMonthEvents(someEvents as Event[]);
	};

	const filterEventsByDate = (
		events: Event[] | undefined,
		date: Date,
		view: string
	) => {
		if (!events) return [];
		const actualDate = new Date();
		actualDate.setMinutes(actualDate.getMinutes() - EventHandicap);
		const someEvents = events.filter((event: any) => {
			return (
				isDateBetween(
					new Date(event.startDate),
					event.endDate ? new Date(event.endDate) : null,
					new Date(date),
					view
				) && actualDate < new Date(event.startDate)
			);
		});

		return someEvents;
	};

	const isDateBetween = (
		startDate: Date,
		endDate: Date | null,
		day: Date,
		view: string
	) => {
		const newStart = new Date(startDate);

		newStart.setMinutes(0);
		newStart.setHours(0);
		newStart.setSeconds(0);
		newStart.setMilliseconds(0);

		const newDay = new Date(day);
		newDay.setMinutes(0);
		newDay.setHours(0);
		newDay.setSeconds(0);
		newDay.setMilliseconds(0);

		let newEnd;
		if (!endDate) {
			newEnd = new Date(startDate);
		} else {
			newEnd = new Date(endDate);
			if (
				endDate.getHours() == 0 &&
				endDate.getMinutes() == 0 &&
				view === 'day'
			) {
				newEnd.setMinutes(endDate.getMinutes() - 1);
			} else if (endDate.getDate() === 0 && view === 'month') {
				newEnd.setDate(newEnd.getDate() - 1);
			} else if (endDate.getDate() - 7 === day.getDate() && view === 'week') {
				newEnd.setDate(newEnd.getDate() - 1);
			} else {
				newEnd.setMinutes(0);
			}
		}
		newEnd.setHours(0);
		newEnd.setSeconds(0);
		newEnd.setMilliseconds(0);

		if (view === 'month') {
			newStart.setDate(0);
			newDay.setDate(0);
			newEnd.setDate(0);
		}

		return view !== 'week'
			? newStart <= newDay && newEnd >= newDay
			: newStart >= newDay && newEnd <= moment(newDay).add(7, 'days').toDate();
	};

	const handleSelectEvent = (event: Event) => {
		setEventList(monthEvents);
		router.push(`/events/detail/${event.id}`);
	};

	return (
		<div
			style={{
				marginTop: -20,
				width: 350,
				maxWidth: '95%',
			}}
		>
			<div style={{ marginBottom: 10 }}>
				<br />
				<Title textTitle={`${t['my_agenda']}`}></Title>
			</div>
			<HomeDrawer
				isOpened={isDrawerOpened}
				anchor={window.innerWidth < 768 ? 'bottom' : 'right'}
				showButtons={false}
				setIsOpened={() => setIsDrawerOpened(!isDrawerOpened)}
				content={
					<>
						<Title
							textTitle={`${
								t['month' + drawerDay?.getMonth().toString()]
							}, ${drawerDay?.getDate()}`}
						></Title>
						{drawerEvents.map((event: Event, i: number) => (
							<div key={i}>
								<MyCard
									eventToSubscribe={event}
									color={'#984D98'}
									isSaved={
										myUser?.favoriteEvents?.findIndex(
											(c: any) => c.id === event.id
										) !== -1
									}
									saveEventButton={true}
									onClick={() => {
										handleCardClick(event);
									}}
									onClickTalk={function (): void {}}
									onClickShare={function (): void {}}
									{...event}
									title={event.name!}
									isEvent={true}
									startDate={event.startDate}
									hasEvents={false}
									photoUrl={
										event.photos.length > 0
											? event.photos![0].photoUrl
											: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
									}
									description={event.description}
									id={event.id}
								/>
							</div>
						))}
					</>
				}
			></HomeDrawer>
			<div>
				<MyCalendar
					view={currentView}
					date={drawerDay as Date}
					onSelectEvent={(event) => handleSelectEvent(event)}
					onShowMore={(events, date) => handleShowMore(date)}
					onNavigate={(date, view) => handleNavigate(date, view)}
					events={myUser ? myUser.favoriteEvents! : []}
				/>
				<Typography></Typography>
			</div>

			{/* <Title
				textTitle={
					monthEvents?.length > 0 ? t[`month${focusedDate.getMonth()}`] : ''
				}
			></Title> */}
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				{monthEvents?.map((card: any) => (
					<div key={card.id}>
						<MyCard
							eventToSubscribe={card}
							color={'#984D98'}
							isSaved={
								myUser?.favoriteEvents?.findIndex(
									(c: any) => c.id === card.id
								) !== -1
							}
							saveEventButton={true}
							onClick={() => {
								handleCardClick(card);
							}}
							onClickTalk={function (): void {}}
							onClickShare={function (): void {}}
							{...card}
							title={card.name!}
							isEvent={true}
							startDate={card.startDate}
							hasEvents={card.events?.length > 0}
							photoUrl={
								card.photos.length > 0
									? card.photos![0].photoUrl
									: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
							}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default MyAgenda;
