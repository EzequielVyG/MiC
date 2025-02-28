import {
	default as Button,
	default as MyButton,
} from '@/components/Button/Button';
import Carousel from '@/components/ImageCarousel/Carousel';
import Label from '@/components/Label/Label';
import Loading from '@/components/Loading/Loading';
// import Rating from '@/components/Rating/Rating';
import Tag from '@/components/Tag/Tag';
import TagCategory from '@/components/Tag/TagCategory';
import { Category } from '@/features/Categories/category';
import { Event } from '@/features/Events/Event';
import { getById as findById } from '@/features/Events/hooks/useGetByIdQuery';
import { findByIdentificador } from '@/features/Traslators/hooks/getbyIdentificator';
import { Translator } from '@/features/Traslators/translator';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { putUser } from '@/features/Users/hooks/usePutUserQuery';
import { User } from '@/features/Users/user';
import useEventCategorySelected from '@/hooks/useEventCategorySelected';
import useEventList from '@/hooks/useEventList';
import useSelectedEvent from '@/hooks/utils/useSelectedEvent';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import MapIcon from '@mui/icons-material/Map';
import PhoneIcon from '@mui/icons-material/Phone';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Divider, Grid, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import moment from 'moment';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

const ViewCard: React.FC = () => {
	const router = useRouter();
	const { id } = router.query;
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { data: session } = useSession();

	const [isLoading, setIsLoading] = useState(true);

	const [eventData, setEventData] = useState<Event | null>(null);
	const [organizadores, setOrganizadores] = useState<any>([]);

	const [activeTab, setActiveTab] = useState(0);

	// const [activeTab2, setActiveTab2] = useState(0);

	const [listEventTranslator, setListEventTranslator] = useState<Translator[]>(
		[]
	); // Asegura que list sea un arreglo vacío al inicio

	const [listPlaceTranslator, setListPlaceTranslator] = useState<Translator[]>(
		[]
	); // Asegura que list sea un arreglo vacío al inicio

	const [showFullDescription, setShowFullDescription] = useState(false);
	//const [activeTab2, setActiveTab2] = useState(0);
	const { setSelectedEvent } = useSelectedEvent();
	const [myUser, setMyUser] = useState<User | null>();
	const [isMarked, setIsMarked] = useState<boolean>(false);
	const [currentIndex, setCurrentIndex] = useState(0);
	const { eventList } = useEventList();
	const { setCategorySelected } = useEventCategorySelected();

	useEffect(() => {
		if (session?.user?.email) {
			getuserByEmail(session?.user?.email).then((response) => {
				if (response.data) {
					setMyUser(response.data);
				}
			});
		}
		async function fetchEventData() {
			try {
				if (typeof id === 'string') {
					const event = await findById(id);

					setOrganizadores(
						event.data.participants.filter((p: any) => p.role === 'Organizador')
					);
					setEventData(event.data);
					const listaPlace = await findByIdentificador(
						event.data.place.id,
						'Place'
					);
					setListPlaceTranslator(listaPlace.data);
					const listaEvent = await findByIdentificador(id, 'Event');
					setListEventTranslator(listaEvent.data);
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
			setIsLoading(false);
		}

		fetchEventData();
		const eventsFromURL = router.query.events;
		if (eventsFromURL) {
			const decodedEvents = decodeURIComponent(
				Array.isArray(eventsFromURL) ? eventsFromURL[0] : eventsFromURL
			);
			const parsedEvents = JSON.parse(decodedEvents);

			if (Array.isArray(parsedEvents)) {
				const initialIndex = parsedEvents.findIndex((event) => event.id === id);
				setCurrentIndex(initialIndex !== -1 ? initialIndex : 0);
			} else {
				console.error('Invalid events format:', parsedEvents);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, router.query.events]);

	useEffect(() => {
		const index = myUser?.favoriteEvents?.findIndex((event) => event.id === id);
		if (index !== -1 && myUser) {
			setIsMarked(true);
		} else {
			setIsMarked(false);
		}
	}, [myUser]);

	const toMap = (event: Event) => {
		setSelectedEvent(event);
		router.push({
			pathname: '/home/events',
		});
	};

	const handleTabChange = (
		event: any,
		newValue: React.SetStateAction<number>
	) => {
		setActiveTab(newValue);
	};

	// const handleTabChange2 = (
	//   event: any,
	//   newValue: React.SetStateAction<number>
	// ) => {
	//   setActiveTab2(newValue);
	// };

	const onClickCategory = (category: Category[]) => {
		setCategorySelected(category);
		router.push({
			pathname: '/home/events',
		});
	};

	const onClickBookmark = async () => {
		setIsMarked(!isMarked);
		if (myUser) {
			const data = new FormData();

			data.append('id', myUser.id!);

			data.append('name', myUser.name ? myUser.name : '');

			data.append('email', myUser.email);

			data.append(
				'fechaNacimiento',
				myUser.fechaNacimiento ? myUser.fechaNacimiento.toLocaleString() : ''
			);

			data.append('avatar', myUser.avatar ? myUser.avatar : '');

			if (isMarked) {
				const index = myUser?.favoriteEvents?.findIndex(
					(event) => event.id === id
				);
				myUser.favoriteEvents?.splice(index!, 1);
			} else {
				myUser.favoriteEvents?.push(eventData as Event);
			}
			data.append('favoriteEvents', JSON.stringify(myUser.favoriteEvents));

			await putUser(data);
		} else {
			router.push({
				pathname: '/auth/signin',
			});
		}
	};

	// Función para obtener la traducción del nombre del lugar
	const getTranslatedEventName = () => {
		if (!eventData || !listEventTranslator) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = listEventTranslator.find(
			(item) => item.campo === 'name' && item.idioma === locale
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : eventData.name || '';
	};

	// Función para obtener la descripcion del nombre del lugar
	const getTranslatedEventDescription = () => {
		if (!eventData || !listEventTranslator) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = listEventTranslator.find(
			(item) => item.campo === 'description' && item.idioma === locale
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : eventData.description || '';
	};

	// Función para obtener la traducción del nombre del lugar
	const getTranslatedPlaceName = () => {
		if (!eventData?.place || !listPlaceTranslator) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = listPlaceTranslator.find(
			(item) => item.campo === 'name' && item.idioma === locale
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : eventData?.place.name || '';
	};

	// Función para obtener la descripcion del nombre del lugar
	// const getTranslatedPlaceDescription = () => {
	// 	if (!eventData?.place || !listPlaceTranslator) {
	// 		return ''; // Manejar caso sin datos
	// 	}

	// 	// Buscar la traducción en la lista de traductores
	// 	const translation = listPlaceTranslator.find(
	// 		(item) => item.campo === 'description' && item.idioma === locale
	// 	);

	// 	// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
	// 	return translation
	// 		? translation.traduccion
	// 		: eventData?.place.description || '';
	// };

	const toggleDescription = () => {
		setShowFullDescription(!showFullDescription);
	};

	const handleNext = () => {
		const nextIndex = (currentIndex + 1) % eventList.length;
		setCurrentIndex(nextIndex);
		router.replace(`/events/detail/${eventList[nextIndex]?.id}`);
	};

	const handlePrev = () => {
		const prevIndex = (currentIndex - 1 + eventList.length) % eventList.length;
		setCurrentIndex(prevIndex);
		router.replace(`/events/detail/${eventList[prevIndex]?.id}`);
	};

	const handlePlace = () => {
		router.push(`/places/${eventData!.place.id}`);
	};

	const getDescriptionWithEllipsis = () => {
		const description = getTranslatedEventDescription();
		const maxLength = 150;

		if (description.length > maxLength) {
			if (showFullDescription) {
				return (
					<>
						{description}{' '}
						<span
							onClick={toggleDescription}
							style={{
								color: 'black',
								cursor: 'pointer',
							}}
						>
							{t['showless']}
						</span>
					</>
				);
			} else {
				return (
					<>
						{`${description.slice(0, maxLength)}... `}
						<span
							onClick={toggleDescription}
							style={{
								color: 'black',
								cursor: 'pointer',
							}}
						>
							{t['showmore']}
						</span>
					</>
				);
			}
		}

		return description;
	};

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					{eventData && (
						<div
							style={{
								padding: 10,
								width: '95vw',
								maxWidth: '500px',
							}}
						>
							{/* eslint-disable-next-line @next/next/no-css-tags */}
							{/* Portada (rectángulo) */}
							{/* {eventData.photos && eventData.photos.length > 0 && (
									<div
									style={{
										width: "100%",
										height: "100px", // Altura del rectángulo de portada
										backgroundColor: "#ccc", // Color de fondo del rectángulo
										position: "relative",
									}}
									>
									<img
										src={eventData.photos[0].photoUrl}
										alt="Portada del evento"
										style={{
										width: "100%",
										height: "100%",
										objectFit: "cover", // Para que la imagen llene el rectángulo
										}}
									/>
									</div>
								)} */}

							{/* Title - Arrows */}
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<IconButton
									onClick={handlePrev}
									disabled={eventList.length <= 1}
								>
									<ArrowBackIos style={{ color: '#B88268' }} />
								</IconButton>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										paddingLeft: 10,
										paddingRight: 10,
									}}
								>
									<Label id={'card_title'} text={getTranslatedEventName()} />
								</div>
								<IconButton
									onClick={handleNext}
									disabled={eventList.length <= 1}
								>
									<ArrowForwardIos style={{ color: '#B88268' }} />
								</IconButton>
							</div>

							{/* Tags Categories */}
							<div>
								{eventData.categories!.map((category, index) => (
									<TagCategory
										key={index}
										text={
											t['categoryTraduction'][category.name]
												? t['categoryTraduction'][category.name]
												: category.name
										}
										color={category.color}
										onClickCategory={() => onClickCategory([category!])}
									/>
								))}
							</div>

							{/* Bookmark button */}
							<Button
								variant='outlined'
								sx={{
									marginTop: 1,
									borderRadius: 2,
									backgroundColor: isMarked ? '#984D98' : 'white',
									borderColor: isMarked ? 'white' : '#984D98',
									color: isMarked ? 'white' : '#984D98',
									gap: '8px',
									'&:hover': {
										backgroundColor: isMarked ? '#C7ABC9' : 'lightgrey',
									},
								}}
								onClick={() => onClickBookmark()}
							>
								<Typography>
									{isMarked ? (
										<Label
											text={t['unschedule_event']}
											style={{ fontSize: 13 }}
										/>
									) : (
										<Label
											text={t['schedule_event']}
											style={{ fontSize: 13 }}
										/>
									)}
								</Typography>
								{isMarked ? (
									<BookmarkIcon sx={{ color: 'white', borderLeft: 2 }} />
								) : (
									<BookmarkBorderIcon
										sx={{ color: '#984D98', borderLeft: 2 }}
									/>
								)}
							</Button>
							{/* Address - To Map */}
							<div
								style={{
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									margin: 5,
								}}
							></div>

							{/* Card - Info */}
							{(eventData.description ||
								eventData.place.domicile ||
								eventData.place.phone ||
								eventData.place.url ||
								eventData.place.facebook_url ||
								eventData.place.instagram_url ||
								eventData.place.twitter_url ||
								eventData.startDate ||
								eventData.endDate) && (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										backgroundColor: '#F3F5F6',
										borderRadius: 8,
										padding: 10,
										margin: 10,
										boxShadow: 'none',
										alignItems: 'center',
									}}
								>
									<Tabs
										value={activeTab}
										onChange={handleTabChange}
										textColor='inherit'
										color='#FFFFFF'
										style={{
											color: '#FFFFFF',
											backgroundColor: '#B88268',
											borderRadius: '12px',
										}}
									>
										<Tab label={t['detail']} />
										<Tab label={t['place']} />
										<Tab label={t['contact']} />
									</Tabs>
									<Box>
										{activeTab === 0 && (
											<div>
												<p>
													<Label
														id={'card_description'}
														color='textSecondary'
														text={
															t['startDate'] +
															': ' +
															moment(eventData.startDate)
																.format('DD/MM/yyyy - HH:mm')
																.concat('hs')
														}
													/>
													{eventData.endDate && (
														<Label
															id={'card_description'}
															color='textSecondary'
															text={
																t['endDate'] +
																': ' +
																moment(eventData.endDate)
																	.format('DD/MM/yyyy - HH:mm')
																	.concat('hs')
															}
														/>
													)}

													<br></br>
													{eventData.price && (
														<Typography
															variant='button'
															style={{ color: '#B88268' }}
														>
															<Label
																text={
																	eventData.price === 'Gratuito'
																		? t['freePass']
																		: t['price'] + ': ' + eventData.price!
																}
															></Label>
														</Typography>
													)}
													<Grid container sx={{ justifyContent: 'center' }}>
														{eventData.urlTicketera !== '' && (
															<div
																style={{
																	padding: 2,
																}}
															>
																<Button
																	variant='outlined'
																	href={eventData.urlTicketera}
																	sx={{
																		marginTop: 1,
																		borderRadius: 1,
																		backgroundColor: '#984D98',
																		borderColor: '#984D98',
																		color: 'white',
																		gap: '8px',
																		'&:hover': {
																			backgroundColor: '#C7ABC9',
																		},
																	}}
																>
																	<Typography
																		fontSize={10}
																		fontWeight={'bold'}
																		letterSpacing={0.5}
																	>
																		{t['getTickets']}
																	</Typography>
																	<Image
																		priority
																		src={require(
																			`../../../../public/ticketIcon.svg`
																		)}
																		alt='Ticket icon'
																		width={20} // Proporcionar el tamaño deseado
																		height={20} // Proporcionar el tamaño deseado
																	/>
																</Button>
															</div>
														)}
														{eventData.url !== '' && (
															<div
																style={{
																	padding: 2,
																}}
															>
																<Button
																	variant='outlined'
																	href={eventData.url}
																	sx={{
																		marginTop: 1,
																		borderRadius: 1,
																		backgroundColor: '#8EA2A5',
																		borderColor: '#8EA2A5',
																		color: 'white',
																		gap: '8px',
																		'&:hover': {
																			backgroundColor: '#636363',
																		},
																	}}
																>
																	<Typography
																		fontSize={10}
																		fontWeight={'bold'}
																		letterSpacing={0.5}
																	>
																		{t['url']}
																	</Typography>
																	<LanguageIcon
																		fontSize='small'
																		style={{ color: 'white' }}
																	/>
																</Button>
															</div>
														)}
													</Grid>
												</p>
												<Typography
													variant='subtitle1'
													component='div'
													color={'textSecondary'}
													onClick={toggleDescription}
													sx={{
														textAlign: 'justify',
														cursor: 'pointer',
													}}
												>
													{getDescriptionWithEllipsis()}
												</Typography>
											</div>
										)}
										{activeTab === 1 && (
											<div>
												<p>
													<Label
														id={'card_description'}
														text={getTranslatedPlaceName()}
														color='textSecondary'
													/>
													{/* <Label
															id={'card_description'}
															text={getTranslatedPlaceDescription()}
														/> */}
													{/* <p>
															<Label text={t['address'] + ': '}></Label>
														</p> */}
													<p>
														<div>
															<Grid
																container
																alignItems='center'
																alignContent={'center'}
																justifyContent={'center'}
																justifyItems={'center'}
															>
																{eventData.place.phone && (
																	<IconButton
																		sx={{
																			backgroundColor: '#34b7f1',
																			borderRadius: '50%',
																			display: 'flex',
																			width: '36px',
																			height: '36px',
																			margin: '0.2rem',
																			'&:hover': {
																				backgroundColor: '#007bff',
																			},
																		}}
																		size='small'
																		onClick={() => {
																			const formattedCMI = eventData.place.cmi
																				? eventData.place.cmi.replace('+', '')
																				: '';
																			const formattedPhone =
																				eventData.place.phone.replace(
																					/[\s()-]/g,
																					''
																				);
																			const phoneNumber = `${formattedCMI}${formattedPhone}`;
																			const telURL = `tel:${phoneNumber}`;
																			window.open(telURL, '_blank');
																		}}
																	>
																		<PhoneIcon
																			style={{
																				color: 'white',
																				fontSize: '18px',
																			}}
																		/>
																	</IconButton>
																)}
																{eventData.place.phone && (
																	<IconButton
																		sx={{
																			backgroundColor: '#25D366',
																			borderRadius: '50%',
																			display: 'flex',
																			width: '36px', // Ajusta el ancho deseado
																			height: '36px', // Ajusta la altura deseada
																			margin: '0.2rem',
																			'&:hover': {
																				backgroundColor: '#1DB954',
																			},
																		}}
																		size='small'
																		onClick={() => {
																			const formattedCMI = eventData.place.cmi
																				? eventData.place.cmi.replace('+', '')
																				: '';
																			const formattedPhone =
																				eventData.place.phone.replace(
																					/[\s()-]/g,
																					''
																				);
																			const phoneNumber = `${formattedCMI}${formattedPhone}`;
																			const whatsappURL = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
																				phoneNumber
																			)}`;
																			window.open(whatsappURL, '_blank');
																		}}
																	>
																		<WhatsAppIcon
																			style={{
																				color: 'white',
																				fontSize: '18px',
																			}}
																		/>
																	</IconButton>
																)}
																{eventData.place.instagram_url && (
																	<IconButton
																		sx={{
																			backgroundColor: '#E4405F',
																			borderRadius: '50%',
																			margin: '0.2rem',
																			'&:hover': {
																				backgroundColor: '#D5354A',
																			},
																		}}
																		size='small'
																		onClick={() => {
																			const user =
																				eventData.place.instagram_url.replace(
																					'@',
																					''
																				);
																			const instagramURL = `https://www.instagram.com/${encodeURIComponent(
																				user
																			)}/`;
																			window.open(instagramURL, '_blank');
																		}}
																	>
																		<InstagramIcon style={{ color: 'white' }} />
																	</IconButton>
																)}
																{eventData.place.facebook_url && (
																	<IconButton
																		sx={{
																			backgroundColor: '#1877F2',
																			borderRadius: '50%',
																			margin: '0.2rem',
																			'&:hover': {
																				backgroundColor: '#0F65DA',
																			},
																		}}
																		size='small'
																		onClick={() => {
																			const user =
																				eventData.place.facebook_url.replace(
																					'@',
																					''
																				);
																			const facebookURL = `https://www.facebook.com/${encodeURIComponent(
																				user
																			)}/`;
																			window.open(facebookURL, '_blank');
																		}}
																	>
																		<FacebookIcon style={{ color: 'white' }} />
																	</IconButton>
																)}
															</Grid>
														</div>
													</p>

													<div
														style={{
															display: 'flex',
															alignItems: 'center', // Alinea los elementos verticalmente
														}}
														onClick={() => toMap(eventData)}
													>
														<IconButton
															sx={{
																backgroundColor: '#8EA2A5',
																borderRadius: '50%',
																margin: '0.2rem',
																'&:hover': {
																	backgroundColor: '#8EA2A5',
																},
															}}
															size='small'
														>
															<MapIcon style={{ color: 'white' }} />
														</IconButton>
														<Label
															id={'card_description'}
															text={eventData.place.domicile}
														/>
													</div>

													{/* <p>
															<Label text={t['contact'] + ': '}></Label>
														</p> */}
												</p>
												<MyButton
													label={'Ver lugar'}
													// startIcon={
													// 	<SwitchAccessShortcutIcon />
													// }
													variant='text'
													onClick={handlePlace}
												/>
											</div>
										)}
										{activeTab === 2 && (
											<p>
												<div>
													{organizadores.map(
														(organizador: any, index: number) => (
															<div key={index}>
																<Label
																	id={'card_description'}
																	text={organizador.organization.legalName}
																	color='textSecondary'
																/>
																<Label
																	id={'card_description'}
																	text={organizador.organization.email}
																	color='textSecondary'
																/>
																<Grid
																	container
																	alignItems='center'
																	justifyContent='center'
																>
																	{' '}
																	{organizador.organization
																		.web_organization_url && (
																		<IconButton
																			sx={{
																				backgroundColor: '#8EA2A5',
																				borderRadius: '50%',
																				margin: '0.2rem',
																				'&:hover': {
																					backgroundColor: '#8EA2A5',
																				},
																			}}
																			size='small'
																			onClick={() => {
																				let url =
																					organizador.organization
																						.web_organization_url;
																				if (!/^https?:\/\//i.test(url)) {
																					url = `https://${url}`;
																				}
																				window.open(url, '_blank');
																			}}
																		>
																			<LanguageIcon
																				style={{ color: 'white' }}
																			/>
																		</IconButton>
																	)}
																	{organizador.organization.facebook_url && (
																		<IconButton
																			sx={{
																				backgroundColor: '#1877F2',
																				borderRadius: '50%',
																				margin: '0.2rem',
																				'&:hover': {
																					backgroundColor: '#0F65DA',
																				},
																			}}
																			size='small'
																			onClick={() => {
																				const user =
																					organizador.organization.facebook_url.replace(
																						'@',
																						''
																					);
																				const facebookURL = `https://www.facebook.com/${encodeURIComponent(
																					user
																				)}/`;
																				window.open(facebookURL, '_blank');
																			}}
																		>
																			<FacebookIcon
																				style={{ color: 'white' }}
																			/>
																		</IconButton>
																	)}
																	{organizador.organization.instagram_url && (
																		<IconButton
																			sx={{
																				backgroundColor: '#E4405F',
																				borderRadius: '50%',
																				margin: '0.2rem',
																				'&:hover': {
																					backgroundColor: '#D5354A',
																				},
																			}}
																			size='small'
																			onClick={() => {
																				const user =
																					organizador.organization.instagram_url.replace(
																						'@',
																						''
																					);
																				const instagramURL = `https://www.instagram.com/${encodeURIComponent(
																					user
																				)}/`;
																				window.open(instagramURL, '_blank');
																			}}
																		>
																			<InstagramIcon
																				style={{ color: 'white' }}
																			/>
																		</IconButton>
																	)}
																	{organizador.organization.twitter_url && (
																		<IconButton
																			sx={{
																				backgroundColor: '#1DA1F2',
																				borderRadius: '50%',
																				margin: '0.2rem',
																				'&:hover': {
																					backgroundColor: '#0B7BBF',
																				},
																			}}
																			size='small'
																			onClick={() => {
																				const user =
																					organizador.organization.twitter_url.replace(
																						'@',
																						''
																					);
																				const twitterURL = `https://twitter.com/${encodeURIComponent(
																					user
																				)}/`;
																				window.open(twitterURL, '_blank');
																			}}
																		>
																			<TwitterIcon style={{ color: 'white' }} />
																		</IconButton>
																	)}
																	{organizador.organization.phone && (
																		<IconButton
																			sx={{
																				backgroundColor: '#25D366',
																				borderRadius: '50%',
																				display: 'flex',
																				width: '36px', // Ajusta el ancho deseado
																				height: '36px', // Ajusta la altura deseada
																				margin: '0.2rem',
																				'&:hover': {
																					backgroundColor: '#1DB954',
																				},
																			}}
																			size='small'
																			onClick={() => {
																				const formattedCMI = organizador
																					.organization.cmi
																					? organizador.organization.cmi.replace(
																							'+',
																							''
																					  )
																					: '';
																				const formattedPhone =
																					organizador.organization.phone.replace(
																						/[\s()-]/g,
																						''
																					);
																				const phoneNumber = `${formattedCMI}${formattedPhone}`;
																				const whatsappURL = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
																					phoneNumber
																				)}`;
																				window.open(whatsappURL, '_blank');
																			}}
																		>
																			<WhatsAppIcon
																				style={{
																					color: 'white',
																					fontSize: '18px',
																				}}
																			/>
																		</IconButton>
																	)}
																</Grid>
																{/* Agregar Divider si hay más de un organizador */}
																{index < organizadores.length - 1 && (
																	<Divider
																		sx={{
																			border: '1px solid #ccc',
																			marginY: '1rem',
																			width: '100%',
																			borderBottom: '2px solid #ccc',
																		}}
																	/>
																)}
															</div>
														)
													)}

													{/* {eventData.place.instagram_url && (
															<IconButton
																sx={{
																	backgroundColor: '#E4405F',
																	borderRadius: '50%',
																	margin: '0.2rem',
																	'&:hover': {
																		backgroundColor: '#D5354A',
																	},
																}}
																size='small'
																onClick={() => {
																	const user =
																		eventData.place.instagram_url.replace(
																			'@',
																			''
																		);
																	const instagramURL = `https://www.instagram.com/${encodeURIComponent(
																		user
																	)}/`;
																	window.open(instagramURL, '_blank');
																}}
															>
																<InstagramIcon style={{ color: 'white' }} />
															</IconButton>
														)}
														{eventData.place.facebook_url && (
															<IconButton
																sx={{
																	backgroundColor: '#1877F2',
																	borderRadius: '50%',
																	margin: '0.2rem',
																	'&:hover': {
																		backgroundColor: '#0F65DA',
																	},
																}}
																size='small'
																onClick={() => {
																	const user =
																		eventData.place.facebook_url.replace(
																			'@',
																			''
																		);
																	const facebookURL = `https://www.facebook.com/${encodeURIComponent(
																		user
																	)}/`;
																	window.open(facebookURL, '_blank');
																}}
															>
																<FacebookIcon style={{ color: 'white' }} />
															</IconButton>
														)} */}
													{/* </Grid> */}
												</div>
											</p>
										)}
									</Box>
								</div>
							)}

							{/* 
                              },
                            }}
                            size="small"
                            onClick={() => toMap(eventData)}
                          >
                            <MapIcon style={{ color: "white" }} />
                          </IconButton>
                          <Label
                            id={"card_description"}
                            text={eventData.place.domicile}
                          />
                        </p>
                      </div>
                    )}
                    {activeTab === 2 && (
                      <div>
                        <p>
                          <Label text={eventData.creator.email}></Label>
                        </p>
                      </div>
                    )}
                  </Box>
                </div>
              )}
              <Tag color="#984D98" width="87%" text={"Entradas"}></Tag>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  backgroundColor: "#F3F5F6",
                  borderRadius: 8,
                  padding: 10,
                  margin: 10,
                  boxShadow: "none",
                  alignItems: 'center',
                }}
              >
                <Tabs
                  value={activeTab2}
                  onChange={handleTabChange2}
                  textColor="inherit"
                  //indicatorColor=""
                  color="#FFFFFF"
                  style={{
                    color: "#FFFFFF",
                    backgroundColor: "#B88268",
                    borderRadius: "12px",
                  }}
                >
                  <Tab label={t["lugar"]} />
                  <Tab label={t["funcion"]}  />
                  <Tab label={t["pagar"]}  />
                </Tabs>
                <Box>
                  {activeTab2 === 0 && (
                    <div>
                      <p>
                        <FormControl
                          sx={{
                            m: 1,
                            minWidth: 120,
                            width: "95%",
                            backgroundColor: "#8EA2A5",
                          }}
                          size="small"
                        >
                          <InputLabel
                            sx={{ color: "#FFFFFF" }}
                            id="demo-select-small-label"
                          >
                          <Label text={t["elegirFila"]}></Label>
                          </InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            label="Fila"
                            sx={{
                              "& svg": {
                                fill: "#FFFFFF", // Cambia el color de la flecha desplegable aquí
                              },
                            }}
                          ></Select>
                        </FormControl>
                      </p>
                      <FormControl
                        sx={{
                          m: 1,
                          minWidth: 120,
                          width: "95%",
                          backgroundColor: "#8EA2A5",
                        }}
                        size="small"
                      >
                        <InputLabel
                          sx={{ color: "#FFFFFF" }}
                          id="demo-select-small-label"
                        >
                          <Label text={t["elegirButaca"]}></Label>
                        </InputLabel>
                        <Select
                          labelId="demo-select-small-label"
                          id="demo-select-small"
                          label="Fila"
                          sx={{
                            "& svg": {
                              fill: "#FFFFFF", // Cambia el color de la flecha desplegable aquí
                            },
                          }}
                        ></Select>
                      </FormControl>
                    </div>
                  )}
                  {activeTab2 === 1 && (
                    <div>
                      <p>
                        <FormControl
                          sx={{
                            m: 1,
                            minWidth: 120,
                            width: "95%",
                            backgroundColor: "#8EA2A5",
                          }}
                          size="small"
                        >
                          <InputLabel
                            sx={{ color: "#FFFFFF" }}
                            id="demo-select-small-label"
                          >
                          <Label text={t["elegirFuncion"]}></Label>
                          </InputLabel>
                          <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            label="Fila"
                            sx={{
                              "& svg": {
                                fill: "#FFFFFF", // Cambia el color de la flecha desplegable aquí
                              },
                            }}
                          ></Select>
                        </FormControl>
                      </p>
                    </div>
                  )}
                  {activeTab2 === 2 && (
                    <div>
                      <p>
                        <Label text={""}></Label>
                      </p>
                    </div>
                  )}
                </Box>
              </div> */}

							{/* Card - Images */}
							{eventData.photos!.length > 0 && (
								<div
									style={{
										display: 'flex',
										flexDirection: 'column',
										backgroundColor: '#F3F5F6',
										borderRadius: 5,
										padding: 10,
										margin: 10,
										boxShadow: 'none',
									}}
								>
									<div
										style={{
											display: 'flex',
											marginBottom: 10,
										}}
									>
										<Tag text='Fotos' />
									</div>
									<Carousel
										images={eventData.photos!.map((photo) => photo.photoUrl)}
									/>
								</div>
							)}
						</div>
					)}
				</>
			)}
		</MainLayout>
	);
};

export default ViewCard;
