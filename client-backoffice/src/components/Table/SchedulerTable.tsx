import React from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from '@mui/material';

type Schedule = {
	openingHour: string;
	closingHour: string;
};

type DaySchedule = {
	day: string;
	checked: boolean;
	schedules: Schedule[];
};

type SchedulerTableProps = {
	data: DaySchedule[];
};

const capitalizeFirstLetter = (text: string) => {
	return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const formatTime = (time: string) => {
	const [hour, minute] = time.split(':');
	return `${hour}:${minute}`;
};

const SchedulerTable: React.FC<SchedulerTableProps> = ({ data }) => {
	return (
		<TableContainer component={Paper}>
			<Table>
				<TableHead>
					<TableRow>
						<TableCell align='center'>Día</TableCell>
						<TableCell align='center'>Horarios</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{data.map((daySchedule, index) => (
						<TableRow key={index}>
							<TableCell align='center'>
								{capitalizeFirstLetter(daySchedule.day)}
							</TableCell>
							<TableCell align='center'>
								{daySchedule.schedules.length > 0
									? daySchedule.schedules.length === 1 &&
									  daySchedule.schedules[0].openingHour === '00:00' &&
									  daySchedule.schedules[0].closingHour === '23:59'
										? 'Abierto todo el día'
										: daySchedule.schedules.map((schedule, i) => (
												<div key={i}>
													{`${formatTime(schedule.openingHour)} - ${formatTime(
														schedule.closingHour
													)}`}
												</div>
										  ))
									: 'Cerrado'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</TableContainer>
	);
};

export default SchedulerTable;
