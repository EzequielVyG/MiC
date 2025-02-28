import { Event } from '@/features/Events/Event';
import {
	subscribeEvent,
	unsubscribeEvent,
} from '@/features/Users/hooks/useSubscribeUnsubscribeEvent';
import useMyUser from '@/hooks/useMyUser';
import en from '@/locale/en';
import es from '@/locale/es';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import CallIcon from '@mui/icons-material/Call';
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import ShareIcon from '@mui/icons-material/Share';
import { Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import moment from 'moment';
import 'moment/locale/es';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

type CardProps = {
	id?: string;
	title: string;
	description?: string;
	photoUrl?: string;
	startDate?: Date;
	eventToSubscribe?: Event;
	saveEventButton?: boolean;
	color?: string;
	isSaved?: boolean;
	isEvent?: boolean;
	hasEvents?: boolean;
	phone?: string;
	onClick: () => void;
	onClickTalk: () => void;
	onClickShare: () => void;
};
const MyCard: React.FC<CardProps> = ({
	title,
	description,
	photoUrl,
	hasEvents = false,
	color,
	isEvent,
	startDate,
	onClick,
	onClickTalk,
	onClickShare,
	saveEventButton,
	eventToSubscribe,
	phone,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const { myUser, setMyUser } = useMyUser();

	const [isMarked, setIsMarked] = useState<boolean>(false);

	useEffect(() => {
		if (!myUser) {
			setIsMarked(false);
		} else {
			setIsMarked(
				myUser?.favoriteEvents?.findIndex(
					(c) => c.id === eventToSubscribe?.id
				) !== -1
			);
		}
	}, [myUser]);

	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;

	const onClickBookmark = async () => {
		setIsMarked(!isMarked);
		if (!myUser) {
			router.push({
				pathname: '/auth/signin',
				query: { error: t['signInSubscribeEvent'] },
			});
		} else {
			const updatedUser = { ...myUser };
			if (!isMarked) {
				await subscribeEvent(myUser.email, eventToSubscribe!);
				updatedUser.favoriteEvents = [
					...(updatedUser.favoriteEvents ? updatedUser.favoriteEvents : []),
					eventToSubscribe!,
				];
			} else {
				updatedUser.favoriteEvents = (
					await unsubscribeEvent(updatedUser.email, eventToSubscribe!)
				).data.favoriteEvents;
			}
			setMyUser(updatedUser);
		}
	};
	const currentDate = moment();

	let formattedStartDate = '';

	if (startDate) {
		const duration = moment(startDate).diff(currentDate, 'minutes');

		if (duration >= 0) {
			if (duration < 60) {
				formattedStartDate = t['begins'] + duration + t['minutes'];
			} else if (duration < 120) {
				formattedStartDate = t['oneHour'];
			} else if (duration > 120 && duration < 60 * 24) {
				formattedStartDate =
					t['begins'] + Math.floor(duration / 60) + t['hours'];
			} else if (moment(startDate).isAfter(currentDate)) {
				const daysDiff = moment(startDate).diff(currentDate, 'days');
				if (daysDiff === 1) {
					formattedStartDate =
						t['tomorrow'] + moment(startDate).format('HH:mm');
				} else if (daysDiff <= 6) {
					formattedStartDate = t['begins'] + daysDiff + t['days'];
				} else if (daysDiff == 7) {
					formattedStartDate = t['oneWeek'];
				} else {
					formattedStartDate = `${moment(startDate).format(
						'D [de] MMMM [a las] HH:mm'
					)}`;
				}
			}
		} else if (duration < 0 && duration >= -60) {
			formattedStartDate = t['began'] + Math.abs(duration) + t['ago'];
		} else if (duration < -60) {
			const hoursAgo = Math.floor(Math.abs(duration) / 60);
			if (hoursAgo < 2) {
				formattedStartDate = t['hourAgo'];
			}
		}
	}

	const handleTalkClick = () => {
		if (phone) {
			onClickTalk();
		}
	};

	return (
		<Card
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
			sx={{
				display: 'flex',
				flexDirection: 'row', // Cambiamos la dirección a fila para tener la imagen a la derecha
				cursor: 'pointer',
				transform: isHovered ? 'scale(1.05)' : 'scale(1)', // Agranda un poco la tarjeta al pasar el mouse por encima
				transition: 'transform 0.3s ease', // Agrega una transición suave
				backgroundColor: '#F3F5F6',
				borderRadius: 5,
				margin: 1,
				boxShadow: 'none', // Elimina la sombra
				width: '95%',
				height: '150px',
			}}
		>
			<CardActionArea>
				<CardContent>
					<Typography id={'card_description'} variant='h1'>
						{' '}
						{title.length > 30 ? `${title.substring(0, 25)}...` : title}
					</Typography>
					<Typography variant='body2' style={{ color: '#B88268' }}>
						{isEvent
							? formattedStartDate
							: description
							? description.length > 40
								? `${description.substring(0, 40)}...`
								: description
							: ``}
					</Typography>

					<div style={{ display: 'flex', justifyContent: 'center' }}>
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								handleTalkClick();
							}}
							sx={{
								backgroundColor: phone ? '#8EA2A5' : '#D3D3D3',
								borderRadius: '50%',
								margin: '0.5rem',
								cursor: phone ? 'pointer' : 'not-allowed',
								'&:hover': {
									backgroundColor: phone ? '#8EA2A5' : '#D3D3D3',
								},
							}}
							size='medium'
						>
							<CallIcon style={{ color: phone ? 'white' : '#A9A9A9' }} />
						</IconButton>
						{saveEventButton ? (
							<IconButton
								onClick={(e) => {
									e.stopPropagation();
									onClickBookmark();
								}}
								sx={{
									margin: '0.5rem',
									backgroundColor: isMarked ? '#984D98' : '#8EA2A5',
									color: 'white',
									'&:hover': {
										backgroundColor: '#8EA2A5',
									},
								}}
								size='medium'
							>
								{isMarked ? (
									<BookmarkIcon sx={{ color: 'white' }} />
								) : (
									<BookmarkBorderIcon sx={{ color: 'white' }} />
								)}
							</IconButton>
						) : (
							<></>
						)}
						{!saveEventButton ? (
							// <IconButton
							// 	sx={{
							// 		backgroundColor: hasEvents ? '#8F3FA3' : '#8EA2A5',
							// 		borderRadius: '50%',
							// 		margin: '0.5rem',
							// 		'&:hover': {
							// 			backgroundColor: '#A589A7',
							// 		},
							// 	}}
							// 	size='medium'
							// >
							// 	<EventAvailableTwoToneIcon style={{ color: 'white' }} />
							// </IconButton>
							<IconButton
							sx={{
								backgroundColor: hasEvents ? '#8F3FA3' : '#8EA2A5',
								borderRadius: '50%',
								margin: '0.5rem',
								'&:hover': {
									backgroundColor: '#A589A7',
								},
							}}
							size='medium'
						>
								<EventAvailableTwoToneIcon style={{ color: 'white' }} />
						</IconButton>
						) : (
							<></>
						)}
						<IconButton
							onClick={(e) => {
								e.stopPropagation();
								onClickShare();
							}}
							sx={{
								backgroundColor: '#8EA2A5',
								borderRadius: '50%',
								margin: '0.5rem',
								'&:hover': {
									backgroundColor: '#8EA2A5',
								},
							}}
							size='medium'
						>
							<ShareIcon style={{ color: 'white' }} /> {/* Icono en blanco */}
						</IconButton>
					</div>
				</CardContent>
			</CardActionArea>
			<CardMedia
				component='img'
				height='120' // Ajusta la altura al 100% de la card
				width='40%'
				image={photoUrl}
				alt={title}
				sx={{
					objectFit: 'cover',
					mt: 'auto',
					margin: 1,
					borderRadius: 5,
					overflow: 'hidden', // Recorta el contenido que exceda los límites
				}}
			></CardMedia>
			<div
				style={{
					height: '5px',
					width: '100%',
					backgroundColor: color,
					position: 'absolute',
					bottom: 0,
				}}
			/>
		</Card>
	);
};

export default MyCard;
