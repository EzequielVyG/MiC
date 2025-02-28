import {
	Card,
	CardActionArea,
	CardContent,
	Typography,
	Box,
} from '@mui/material';
import React, { useState } from 'react';

type CardProps = {
	title: string;
	description: string;
	date: string;
	status?: string;
	onClick?: () => void;
};

const CardNotification: React.FC<CardProps> = ({
	title,
	description,
	date,
	status,
	onClick,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<Card
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			sx={{
				borderRadius: 2,
				mb: 2,
				cursor: 'pointer',
				width: '80vw',
				minWidth: '100px',
				maxWidth: '400px',
				transition: 'transform 0.3s ease',
				...(isHovered && { boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)' }),
				display: 'flex',
				flexDirection: 'column',
				boxShadow: 'none',
				opacity: status !== 'Leido' ? '100%' : '70%',
				backgroundColor: status !== 'Leido' ? '#E8ECED' : '#C7ABC9',
			}}
		>
			<CardActionArea>
				<Box
					sx={{
						backgroundColor: status !== 'Leido' ? '#8EA2A5' : '#C7ABC9',
						color: 'white',
						borderRadius: 2,
						display: 'flex',
						justifyContent: 'space-between', // Alinea los elementos en la misma fila
						alignItems: 'center',
						padding: '8px 16px 0 16px',
					}}
				>
					<div>
						<Typography variant='h6' component='div' fontWeight='bold'>
							{title}
						</Typography>
					</div>
					<div>
						<Typography
							variant='caption'
							color='white'
							fontSize={18}
							fontWeight={'bold'}
						>
							{date}
						</Typography>
					</div>
				</Box>
				<CardContent
					sx={{ backgroundColor: status !== 'Leido' ? '#E8ECED' : '#C7ABC9' }}
				>
					<Typography
						variant='body2'
						color={status !== 'Leido' ? '#8EA2A5' : 'white'}
						fontSize={16}
					>
						{description}
					</Typography>
				</CardContent>
			</CardActionArea>
		</Card>
	);
};

export default CardNotification;
