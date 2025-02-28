import React from 'react';
import ModalComponent from './ModalComponent'; // Asegúrate de importar el componente Modal adecuado
import { FormControlLabel, Switch, IconButton } from '@mui/material';
import Label from '@/components/Label/Label';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@/components/Button/Button';
type DaySchedule = {
	day: string;
	checked: boolean;
	schedules: {
		openingHour: string;
		closingHour: string;
	}[];
};

type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	daysOfWeek: DaySchedule[];
	setDaysOfWeek: (updatedDays: DaySchedule[]) => void;
	handleOpeningHourChange: (
		value: string,
		dayIndex: number,
		scheduleIndex: number
	) => void;
	handleClosingHourChange: (
		value: string,
		dayIndex: number,
		scheduleIndex: number
	) => void;
	removeSchedule: (dayIndex: number, openingHour: string) => void;
	addNewSchedule: (
		dayIndex: number,
		aOpeningHour?: string,
		aClosingHour?: string
	) => void;
};

const SchedulerModal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	daysOfWeek,
	setDaysOfWeek,
	handleOpeningHourChange,
	handleClosingHourChange,
	removeSchedule,
	addNewSchedule,
}) => {
	const handleDayToggle = (dayIndex: number) => {
		const updatedDaysOfWeek = [...daysOfWeek];
		updatedDaysOfWeek[dayIndex].checked = !updatedDaysOfWeek[dayIndex].checked;

		if (!updatedDaysOfWeek[dayIndex].checked) {
			for (const schedule of updatedDaysOfWeek[dayIndex].schedules) {
				removeSchedule(dayIndex, schedule.openingHour);
			}
		} else {
			addNewSchedule(dayIndex, '00:00', '23:59');
		}

		setDaysOfWeek(updatedDaysOfWeek);
	};

	return (
		<ModalComponent isOpen={isOpen} onClose={onClose}>
			<div style={{ display: 'flex', flexDirection: 'column' }}>
				<Label
					text={'Agregar horarios'}
					sx={{ display: 'flex', justifyContent: 'center' }}
				></Label>
				{daysOfWeek.map((currentDay, dayIndex) => (
					<div key={currentDay.day} style={{ marginBottom: '10px' }}>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Label text={currentDay.day} sx={{ width: '150px' }} />
							<FormControlLabel
								control={
									<Switch
										checked={currentDay.checked}
										onChange={() => handleDayToggle(dayIndex)}
										sx={{ justifyContent: 'right' }}
									/>
								}
								label={currentDay.checked ? 'Abierto' : 'Cerrado'}
								sx={{ margin: 'auto' }}
							/>
						</div>
						{currentDay.checked && (
							<div style={{ marginLeft: '100px' }}>
								<Button
									onClick={() => addNewSchedule(dayIndex)}
									color='primary'
									variant='text'
								>
									Agregar horario
								</Button>
								{currentDay.schedules.map(
									(
										schedule: {
											openingHour: string;
											closingHour: string;
										},
										scheduleIndex: number
									) => (
										<div key={scheduleIndex}>
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
													gap: '10px',
												}}
											>
												<input
													type='time'
													value={schedule.openingHour}
													onChange={(e) =>
														handleOpeningHourChange(
															e.target.value,
															dayIndex,
															scheduleIndex
														)
													}
												/>

												<input
													type='time'
													value={schedule.closingHour}
													onChange={(e) =>
														handleClosingHourChange(
															e.target.value,
															dayIndex,
															scheduleIndex
														)
													}
												/>
												<IconButton
													onClick={() =>
														removeSchedule(dayIndex, schedule.openingHour)
													}
													aria-label='Remove schedule'
												>
													<CloseIcon />
												</IconButton>
											</div>
										</div>
									)
								)}
							</div>
						)}
					</div>
				))}

				<Button onClick={onClose}>Cerrar</Button>
			</div>
		</ModalComponent>
	);
};

export default SchedulerModal;
