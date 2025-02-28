import ImageCarousel from '@/components/ImageCarousel/Carousel';
import Label from '@/components/Label/Label';
import Loading from '@/components/Loading/Loading';
import ScheduleAccordion from '@/components/ScheduleAccordion/ScheduleAccordion';
import Tag from '@/components/Tag/Tag';
import TagCategory from '@/components/Tag/TagCategory';
import { findById } from '@/features/Places/hooks/useFindByIdQuery';
import { Place } from '@/features/Places/place';
import { findByIdentificador } from '@/features/Traslators/hooks/getbyIdentificator';
import { Translator } from '@/features/Traslators/translator';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EventAvailableTwoToneIcon from '@mui/icons-material/EventAvailableTwoTone';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import MapIcon from '@mui/icons-material/Map';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import IconButton from '@mui/material/IconButton';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import CardEvent from '@/components/Card/CardEvent';
import { Category } from '@/features/Categories/category';
import usePlaceCategorySelected from '@/hooks/usePlaceCategorySelected';
import usePlaceList from '@/hooks/usePlaceList';
import useSelectedPlace from '@/hooks/useSelectedPlace';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { Grid, Typography } from '@mui/material';
import moment from 'moment';
import { Carousel } from 'react-responsive-carousel';

const ViewCard: React.FC = () => {
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { id } = router.query;

	const [isLoading, setIsLoading] = useState(true);

	const [showFullDescription, setShowFullDescription] = useState(false);
	const [showFullNote, setShowFullNote] = useState(false);
	const [placeData, setPlaceData] = useState<Place | null>(null);
	const [list, setList] = useState<Translator[]>([]); // Asegura que list sea un arreglo vacío al inicio
	const { setCategorySelected } = usePlaceCategorySelected();
	const [currentIndex, setCurrentIndex] = useState(0);
	const { setSelectedPlace } = useSelectedPlace();
	const { placeList } = usePlaceList();

	const handleOnSelect = (index: number) => {
		setCurrentIndex(index);
	};

	useEffect(() => {
		async function fetchPlaceData() {
			try {
				if (typeof id === 'string') {
					const place = await findById(id);
					const lista = await findByIdentificador(id, 'Place');
					setList(lista.data);
					setPlaceData(place.data);
				}
			} catch (error) {
				console.error('Error fetching place data:', error);
			}
			setIsLoading(false);
		}

		fetchPlaceData();

		const placesFromURL = router.query.places;
		if (placesFromURL) {
			const decodedPlaces = decodeURIComponent(
				Array.isArray(placesFromURL) ? placesFromURL[0] : placesFromURL
			);
			const parsedPlaces = JSON.parse(decodedPlaces);

			if (Array.isArray(parsedPlaces)) {
				const initialIndex = parsedPlaces.findIndex((place) => place.id === id);
				setCurrentIndex(initialIndex !== -1 ? initialIndex : 0);
			} else {
				console.error('Invalid places format:', parsedPlaces);
			}
		}
	}, [id, router.query.places]);

	const toMap = (place: Place) => {
		setSelectedPlace(place),
			router.push({
				pathname: '/home/places',
			});
	};

	// Función para obtener la traducción del nombre del lugar
	const getTranslatedPlaceName = () => {
		if (!placeData || !list) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = list.find(
			(item) => item.campo === 'name' && item.idioma === locale
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : placeData.name || '';
	};

	// Función para obtener la descripcion del nombre del lugar
	const getTranslatedPlaceNote = () => {
		if (!placeData || !list) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = list.find(
			(item) => item.campo === 'note' && item.idioma === locale
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : placeData.note || '';
	};

	// Función para obtener la descripcion del nombre del lugar
	const getTranslatedPlaceDescription = () => {
		if (!placeData || !list) {
			return ''; // Manejar caso sin datos
		}

		// Buscar la traducción en la lista de traductores
		const translation = list.find(
			(item) => item.campo === 'description' && item.idioma === locale
		);

		// Si se encontró la traducción, devolverla; de lo contrario, usar el nombre predeterminado
		return translation ? translation.traduccion : placeData.description || '';
	};

	const goToPlaceEvents = (eventId: string) => {
		router.push(`/events/detail/${eventId}`);
	};

	const onClickCategory = (category: Category[]) => {
		setCategorySelected(category);
		router.push({
			pathname: '/home/places',
		});
	};

	const toggleDescription = () => {
		setShowFullDescription(!showFullDescription);
	};

	const toggleNote = () => {
		setShowFullNote(!showFullNote);
	};

	const handleNext = () => {
		const nextIndex = (currentIndex + 1) % placeList.length;
		setCurrentIndex(nextIndex);
		router.replace(`/places/${placeList[nextIndex]?.id}`);
	};

	const handlePrev = () => {
		const prevIndex = (currentIndex - 1 + placeList.length) % placeList.length;
		setCurrentIndex(prevIndex);
		router.replace(`/places/${placeList[prevIndex]?.id}`);
	};
	
	const getEllipsizedText = (text:any, maxLength:any, showFull:any, toggleFunction:any) => {
		if (text.length > maxLength) {
		  return (
			<>
			  {showFull ? text : `${text.slice(0, maxLength)}...`}{' '}
			  <span
				onClick={toggleFunction}
				style={{
				  color: 'black',
				  cursor: 'pointer',
				}}
			  >
				{showFull ? t['showless'] : t['showmore']}
			  </span>
			</>
		  );
		}
		return text;
	  };

	return (
		<MainLayout>
			{isLoading ? (
				<Loading />
			) : (
				<>
					{placeData && (
						<div
							style={{
								padding: 10,
							}}
						>
							<div style={{ display: 'flex', justifyContent: 'center' }}>
								<IconButton
									onClick={handlePrev}
									disabled={placeList.length <= 1}
								>
									<ArrowBackIos style={{ color: '#B88268' }} />
								</IconButton>
								<IconButton
									onClick={handleNext}
									disabled={placeList.length <= 1}
								>
									<ArrowForwardIos style={{ color: '#B88268' }} />
								</IconButton>
							</div>
							{/* Title - Rating */}
							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										maxWidth: '400px',
									}}
								>
									<Label id={'card_title'} text={getTranslatedPlaceName()} />
								</div>
							</Grid>

							<br />

							{/* PrincipalCategory - Categories */}
							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								{[
									placeData.principalCategory,
									...(placeData.categories || []),
								].map((category, index) => (
									<React.Fragment key={index}>
										{category &&
											(index === 0 ||
												category.name !==
												placeData.principalCategory?.name) && (
												<TagCategory
													text={t['categoryTraduction'][category!.name]}
													color={category!.color}
													onClickCategory={() => onClickCategory([category!])}
												/>
											)}
										{(index + 1) % 3 === 0 && (
											<div style={{ width: '100%', height: '10px' }} />
										)}
									</React.Fragment>
								))}
							</Grid>

							<br />

							{/* Address - To Map */}
							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
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
									onClick={() => toMap(placeData)}
								>
									<MapIcon style={{ color: 'white' }} />
								</IconButton>
								<Label id={'card_description'} text={placeData.domicile} />
							</Grid>

							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								{/* Card - Info */}
								{(placeData.url ||
									placeData.facebook_url ||
									placeData.instagram_url ||
									placeData.twitter_url ||
									placeData.phone ||
									placeData.description ||
									placeData.note) && (
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												backgroundColor: '#F3F5F6',
												borderRadius: 5,
												paddingLeft: 10,
												margin: 10,
												boxShadow: 'none',
												maxWidth: '400px', // Ajusta este valor según sea necesario
												width: '100%', // Asegura que ocupe el ancho completo
											}}
										>
											<div
												style={{
													display: 'flex',
												}}
											>
												<Tag text={t['nosotros']} />
											</div>
											<div
												style={{
													display: 'flex',
													flexDirection: 'column',
													backgroundColor: '#F3F5F6',
													borderRadius: 5,
													maxWidth: '400px',
													margin: 10,
													boxShadow: 'none',
												}}
											>
												    {getTranslatedPlaceDescription() && (
														<>
														<Typography
															variant="body1"
															component="div"
															color={'textSecondary'}
															style={{ textAlign: 'justify', cursor:'pointer' }}
														>
															{getEllipsizedText(
															getTranslatedPlaceDescription(),
															300,
															showFullDescription,
															toggleDescription
															)}
														</Typography>
														<br />
														</>
													)}
													<br />
													{getTranslatedPlaceNote() && (
														<>
														<Typography
															variant="body1"
															component="div"
															color={'textSecondary'}
															style={{ textAlign: 'justify', cursor:'pointer' }}
														>
															{getEllipsizedText(
															getTranslatedPlaceNote(),
															300,
															showFullNote,
															toggleNote
															)}
														</Typography>
														<br />
														</>
													)}
												<br />
												{placeData.url ||
													placeData.facebook_url ||
													placeData.instagram_url ||
													placeData.twitter_url ||
													placeData.phone ? (
													<div style={{ display: 'flex', marginLeft: '-10px' }}>
														<Tag text={'Contacto'} />
													</div>
												) : null}
												<Grid
													container
													alignItems='center'
													alignContent={'center'}
													justifyContent={'center'}
													justifyItems={'center'}
												>
													{placeData.url && (
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
																let url = placeData.url;
																if (!/^https?:\/\//i.test(url)) {
																	url = `https://${url}`;
																}
																window.open(url, '_blank');
															}}
														>
															<LanguageIcon style={{ color: 'white' }} />
														</IconButton>
													)}

													{placeData.facebook_url && (
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
																const user = placeData.facebook_url.replace(
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

													{placeData.instagram_url && (
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
																const user = placeData.instagram_url.replace(
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

													{placeData.twitter_url && (
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
																const user = placeData.twitter_url.replace(
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
													{placeData.phone && (
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
																const formattedCMI = placeData.cmi
																	? placeData.cmi.replace('+', '')
																	: '';
																const formattedPhone = placeData.phone.replace(/[\s()-]/g, '');
																const phoneNumber = `${formattedCMI}${formattedPhone}`;
																const whatsappURL = `https://api.whatsapp.com/send?phone=${encodeURIComponent(
																	phoneNumber
																)}`;
																window.open(whatsappURL, '_blank');
															}}
														>
															<WhatsAppIcon
																style={{ color: 'white', fontSize: '18px' }}
															/>
														</IconButton>
													)}
												</Grid>
											</div>
										</div>
									)}
							</Grid>

							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
								justifyItems={'center'}
							>
								{/* Card - Schedules */}
								{placeData.schedules && placeData.schedules.length > 0 ? (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											backgroundColor: '#F3F5F6',
											borderRadius: 5,
											paddingLeft: 10,
											margin: 10,
											boxShadow: 'none',
											maxWidth: '400px', // Ajusta este valor según sea necesario
											width: '100%', // Asegura que ocupe el ancho completo
										}}
									>
										<ScheduleAccordion schedules={placeData.schedules!} />
									</div>
								) : null}
							</Grid>

							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								{/* Card - Images */}
								{placeData.photos!.length > 0 && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											backgroundColor: '#F3F5F6',
											borderRadius: 5,
											paddingLeft: 10,
											margin: 10,
											boxShadow: 'none',
											maxWidth: '400px', // Ajusta este valor según sea necesario
											width: '100%', // Asegura que ocupe el ancho completo
										}}
									>
										<div
											style={{
												display: 'flex',
												marginBottom: 10,
											}}
										>
											<Tag text={t['photos']} />
										</div>
										<ImageCarousel
											images={placeData.photos!.map((photo) => photo.photoUrl)}
										/>
									</div>
								)}
							</Grid>

							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								{/* Card - Events */}
								{placeData?.events && placeData.events.length > 0 && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											backgroundColor: '#F3F5F6',
											borderRadius: 5,
											paddingLeft: 10,
											margin: 10,
											boxShadow: 'none',
											maxWidth: '400px', // Ajusta este valor según sea necesario
											width: '100%', // Asegura que ocupe el ancho completo
										}}
									>
										<div style={{ display: 'flex' }}>
											<EventAvailableTwoToneIcon
												style={{
													marginRight: 10,
													padding: 3,
													borderRadius: 20,
													color: 'white',
													backgroundColor: '#8F3FA3',
												}}
											/>
											<Tag text={t['events']} />
											<div style={{ marginLeft: 'auto' }}>
												<Typography>
													{currentIndex + 1} / {placeData.events.length}
												</Typography>
											</div>
										</div>
										<Carousel
											showThumbs={false}
											showArrows={true}
											showStatus={false}
											onChange={handleOnSelect}
										>
											{placeData.events.map((event, index) => (
												<div
													style={{
														marginTop: '10px',
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
													}}
													key={index}
												>
													<CardEvent
														title={event.name}
														description={event.description}
														status=''
														startDate={moment(event.startDate).format(
															'DD/MM/yyyy HH:mm'
														)}
														endDate={
															event.endDate
																? moment(event.endDate).format(
																	'DD/MM/yyyy HH:mm'
																)
																: ''
														}
														photoUrl={
															event.photos!.length > 0
																? event.photos![0].photoUrl
																: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
														}
														price={event.price}
														minors={event.minors}
														id={event.id}
														onClick={() => goToPlaceEvents(event.id)}
													/>
												</div>
											))}
										</Carousel>
									</div>
								)}
							</Grid>

							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								{/* Card - Services */}
								{placeData.services!.length > 0 && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											backgroundColor: '#F3F5F6',
											borderRadius: 5,
											paddingLeft: 10,
											margin: 10,
											boxShadow: 'none',
											maxWidth: '400px', // Ajusta este valor según sea necesario
											width: '100%', // Asegura que ocupe el ancho completo
										}}
									>
										<div
											style={{
												display: 'flex',
											}}
										>
											<Tag text={t['services']} />
										</div>
										<div
											style={{
												padding: 5,
											}}
										>
											{placeData.services!.map((service) => (
												<div
													style={{
														display: 'flex',
														alignItems: 'flex-start',
														margin: 2,
													}}
													key={service.id}
												>
													<CheckCircleIcon style={{ color: '#8EA2A5' }} />
													<Label
														id={'card_description'}
														text={t['service'][service.name]}
													/>
												</div>
											))}
										</div>
									</div>
								)}
							</Grid>

							<Grid
								container
								alignItems='center'
								alignContent={'center'}
								justifyContent={'center'}
							>
								{/* Card - Accesibilities */}
								{placeData.accessibilities!.length > 0 && (
									<div
										style={{
											display: 'flex',
											flexDirection: 'column',
											backgroundColor: '#F3F5F6',
											borderRadius: 5,
											paddingLeft: 10,
											margin: 10,
											boxShadow: 'none',
											maxWidth: '400px', // Ajusta este valor según sea necesario
											width: '100%', // Asegura que ocupe el ancho completo
										}}
									>
										<div
											style={{
												display: 'flex',
											}}
										>
											<Tag text={t['accessibilities']} />
										</div>
										<div
											style={{
												padding: 5,
											}}
										>
											{placeData.accessibilities!.map((accessibilitie) => (
												<div
													style={{
														display: 'flex',
														alignItems: 'flex-start',
														margin: 2,
													}}
													key={accessibilitie.id}
												>
													<CheckCircleIcon style={{ color: '#8EA2A5' }} />
													<Label
														id={'card_description'}
														text={t['accessibility'][accessibilitie.name]}
													/>
												</div>
											))}
										</div>
									</div>
								)}
							</Grid>
						</div>
					)}
				</>
			)}
		</MainLayout>
	);
};

export default ViewCard;
