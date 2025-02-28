import { Button, SxProps } from '@mui/material';
import React from 'react';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

type ButtonProps = {
	label?: string;
	year?: number;
	monthLabel?: string;
	weekLabel?: string;
	dayLabel?: string;
	currentView?: 'day' | 'month' | 'week';
	onPrev?: (e: any) => void;
	onNext?: (e: any) => void;
	onMonth?: (e: any) => void;
	onWeek?: (e: any) => void;
	onDay?: (e: any) => void;
	sx?: SxProps;
};

const MyCalendarButton: React.FC<ButtonProps> = ({
	label,
	onPrev,
	onNext,
	onMonth,
	monthLabel,
	onWeek,
	weekLabel,
	onDay,
	dayLabel,
	year,
	currentView,
	sx,
}) => {
	const height = 30;
	const getSx = (view: string) => {
		return {
			height: height,
			color: 'white',
			backgroundColor: currentView === view ? '#984D98' : '#aaaaaa',
			':hover': {
				color: 'white',
				backgroundColor: currentView === view ? '#984D98' : '#aaaaaa',
			},
			marginBottom: '5%',
			marginTop: '1%',
			borderRadius: 5,
			...sx,
		};
	};
	return (
		<div>
			<Button onClick={onMonth} sx={getSx('month')}>
				{monthLabel}
			</Button>
			<Button onClick={onWeek} sx={{ marginLeft: '2%', ...getSx('week') }}>
				{weekLabel}
			</Button>
			<Button onClick={onDay} sx={{ marginLeft: '2%', ...getSx('day') }}>
				{dayLabel}
			</Button>

			<br />
			<Button
				onClick={onPrev}
				sx={{
					height: height,
					color: 'white',
					backgroundColor: '#984D98',
					':hover': { color: 'white', backgroundColor: '#984D98' },
					marginBottom: '5%',
					marginTop: '1%',
					borderRadius: 5,
					borderBottomRightRadius: 'unset', // Elimina la esquina inferior derecha para que parezca un solo botón
					borderTopRightRadius: 'unset', // Elimina la esquina superior derecha para que parezca un solo botón
					...sx,
				}}
			>
				<ArrowBackIos
					style={{
						color: 'white',
					}}
				/>
			</Button>
			<Button
				disabled
				sx={{
					height: height,
					color: 'white !important',
					backgroundColor: '#984D98',
					':hover': { color: 'white', backgroundColor: '#984D98' },
					marginBottom: '5%',
					marginTop: '1%',
					borderRadius: 0, // Elimina las esquinas redondeadas
					...sx,
				}}
			>
				{label}
			</Button>
			<Button
				onClick={onNext}
				sx={{
					height: height,
					color: 'white',
					backgroundColor: '#984D98',
					':hover': { color: 'white', backgroundColor: '#984D98' },
					marginBottom: '5%',
					marginTop: '1%',
					borderRadius: 5,
					borderBottomLeftRadius: 'unset', // Elimina la esquina inferior izquierda para que parezca un solo botón
					borderTopLeftRadius: 'unset', // Elimina la esquina superior izquierda para que parezca un solo botón
					...sx,
				}}
			>
				<ArrowForwardIos style={{ color: 'white' }} />
			</Button>
			<Button
				disabled
				sx={{
					height: height,
					marginLeft: '2%',
					color: 'white !important',
					backgroundColor: '#984D98',
					':hover': { color: 'white', backgroundColor: '#984D98' },
					marginBottom: '5%',
					marginTop: '1%',
					borderRadius: 5,
					...sx,
				}}
			>
				{year}
			</Button>
		</div>
	);
};

export default MyCalendarButton;
