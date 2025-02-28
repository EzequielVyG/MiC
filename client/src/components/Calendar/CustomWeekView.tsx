import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { DateLocalizer, Navigate } from 'react-big-calendar';
import TimeGrid from 'react-big-calendar/lib/TimeGrid';

interface CustomWeekViewProps {
	date: Date;
	localizer: DateLocalizer;
	max?: Date;
	min?: Date;
	scrollToTime?: Date;
}

const CustomWeekView = ({
	date,
	localizer,
	max = localizer.endOf(new Date(), 'day'),
	min = localizer.startOf(new Date(), 'day'),
	scrollToTime = localizer.startOf(new Date(), 'day'),
	...props
}: CustomWeekViewProps) => {
	const currRange = useMemo(
		() => CustomWeekView.range(date, { localizer }),
		[date, localizer]
	);

	return (
		<TimeGrid
			date={date}
			eventOffset={15}
			localizer={localizer}
			max={max}
			min={min}
			range={currRange}
			scrollToTime={scrollToTime}
			{...props}
		/>
	);
};

CustomWeekView.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	localizer: PropTypes.object,
	max: PropTypes.instanceOf(Date),
	min: PropTypes.instanceOf(Date),
	scrollToTime: PropTypes.instanceOf(Date),
};

CustomWeekView.navigate = (date: Date, action: any, { localizer }: any) => {
	switch (action) {
		case Navigate.PREVIOUS:
			return localizer.add(date, -3, 'day');
		case Navigate.NEXT:
			return localizer.add(date, 3, 'day');
		default:
			return date;
	}
};

CustomWeekView.range = (
	date: Date,
	{ localizer }: { localizer: DateLocalizer }
) => {
	const start = date;
	const end = localizer.add(start, 6, 'day');

	let current = start;
	const range = [];

	while (localizer.lte(current, end, 'day')) {
		range.push(current);
		current = localizer.add(current, 1, 'day');
	}

	return range;
};

CustomWeekView.title = (date: any, { localizer }: any) => {
	const [start, ...rest] = CustomWeekView.range(date, { localizer });
	return localizer.format({ start, end: rest.pop() }, 'dayRangeHeaderFormat');
};

export default CustomWeekView;
