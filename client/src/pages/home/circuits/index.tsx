import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Hidden, IconButton } from '@mui/material';
import MainLayout from '@/layouts/MainLayout';
import CardCarousel from '@/components/Card/CardCarousel';
import Loading from '@/components/Loading/Loading';
import GenericMap from '@/components/Map/GenericMap';

import CardSidebar from '@/components/Card/CardSidebar';
import { FilterEnum } from '@/components/Filter/filter.enum';
import { Event } from '@/features/Events/Event';
import { Place } from '@/features/Places/place';
import { Directions } from '@mui/icons-material';
import HomeDrawer from '@/components/Drawer/HomeDrawer';
import Title from '@/components/Title/Title';
import Card from '@/components/Card/Card';
import useSelectedCircuit from '@/hooks/useSelectedCircuit';
import { findById } from '@/features/Circuits/hooks/useFindById';
import TagCircuit from '@/components/Tag/TagCircuit';
import usePlaceCategorySelected from '@/hooks/usePlaceCategorySelected';
import useSelectedPlace from '@/hooks/useSelectedPlace';
import ReactGA from 'react-ga4';
import usePlaceList from '@/hooks/usePlaceList';
import Tag from '@/components/Tag/Tag';
import en from '@/locale/en';
import es from '@/locale/es';

const HomePage = () => {
	const router = useRouter();
	const { filter } = router.query;
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;

	const [isLoading, setIsLoading] = useState(true);
	const { selectedCircuit } = useSelectedCircuit();
	const [list, setList] = useState<Place[]>([]);

	const [selectedPoint, setSelectedPoint] = useState<Place | null>(null);

	const { setCategorySelected } = usePlaceCategorySelected();
	const { setSelectedPlace } = useSelectedPlace();

	const [selectedCardIndex, setSelectedCardIndex] = useState<
		number | undefined
	>(0);

	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const { setPlaceList } = usePlaceList();

	useEffect(() => {
		ReactGA.send({
			hitType: 'pageview',
			page: '/home/circuits',
			title: 'Visita a mapa de circuitos',
		});
	}, []);

	useEffect(() => {
		setIsLoading(true);
		if (!selectedCircuit) {
			router.push('/circuits');
		}
		fetchCircuitData();
		handleRequestLocation();
		setIsLoading(false);
	}, [selectedCircuit]);

	async function fetchCircuitData() {
		try {
			if (selectedCircuit) {
				const aCircuit = await findById(selectedCircuit.id as string);
				setList(aCircuit.data.places);
			}
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

	const handleCardClick = (place: Place) => {
		const categories = [];
		categories.push(place.categories![0]);
		setCategorySelected(categories);
		setSelectedPlace(place);
		setPlaceList(list);
		router.push(`/places/${place.id}`);
	};

	const handleEventCardClick = (event: Event) => {
		router.push(
			`/events/detail/${event.id}?events=${encodeURIComponent(
				JSON.stringify(list)
			)}`
		);
	};

	const handleMarkerClick = (place: Place | Event, cardIndex: number) => {
		setSelectedCardIndex(cardIndex);

		// Verifica si la pantalla actual es de escritorio o teléfono
		const isDesktop = window.innerWidth >= 768;

		if (isDesktop) {
			// En la vista de escritorio, redirige a la página de detalles correspondiente
			if (filter === FilterEnum.PLACES) {
				router.push(`/places/${place.id}`);
			} else if (filter === FilterEnum.EVENTS) {
				router.push(`/events/detail/${place.id}`);
			}
		}
	};

	const handleCardCentered = (index: number) => {
		setSelectedCardIndex(index); // Actualiza el índice de la tarjeta centrada
		const selectedPlace: Place | Event = list[index];
		setSelectedPoint(selectedPlace);
	};

	const handleCardHover = (place: Place & Event) => {
		setSelectedCardIndex(list.indexOf(place));
	};

	const handleRequestLocation = () => {
		navigator.geolocation.getCurrentPosition(
			(position) => {
				const { latitude, longitude } = position.coords;
				setUserLocation({ lat: latitude, lng: longitude });
			},
			(error) => {
				console.error('Error getting user location:', error);
			},
			{ enableHighAccuracy: true } // Desactiva el cuadro de diálogo predeterminado del navegador
		);
	};

	/*   const handleButtonClick = () => {
	const q = router.query;
	if (circuit_id) {
	  q.circuit_id = circuit_id;
	  q.filter = FilterEnum.PLACES;
	}
	router.push({
	  pathname: `/${q.filter}`,
	  query: q,
	});
  }; */

	/* 	const handleCircuitChange = (event: any, newValue: Circuit | null) => {
		if (newValue) {
			setList(newValue.places);
			setSelectedCardIndex(0);
			setSelectedPoint(newValue.places[0]);
		}
	}; */

	const handleTalkClick = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};

	const handleShareClick = (placeData: any) => {
		if (navigator.share) {
			navigator
				.share({
					title: placeData.name,
					text: placeData.description,
					url: window.location.href,
				})
				.then(() => console.log('Contenido compartido exitosamente'))
				.catch((error) => console.error('Error al compartir:', error));
		} else {
			console.log(
				'La función de compartir no está disponible en este navegador.'
			);
		}
	};

	return isLoading ? (
		<Loading />
	) : (
		<MainLayout>
			<div
				style={{
					top: 75,
					margin: 10,
					width: '95vw',
					flexDirection: 'row',
					alignItems: 'center',
					display: 'flex',
					position: 'absolute',
					maxWidth: '700px',
					zIndex: 2,
					backgroundColor: 'white',
					borderRadius: 20,
				}}
			>
				<div style={{ width: '95vh', zIndex: 3 }}>
					{selectedCircuit ? (
						<TagCircuit
							sx={{
								display: { xs: 'none', md: 'flex' },
							}}
							text={selectedCircuit.name}
							color={selectedCircuit.principalCategory.color}
						/>
					) : (
						<></>
					)}
				</div>

				<div>
					{list.length != 0 && selectedCircuit ? (
						<HomeDrawer
							content={
								<>
									<Title textTitle={selectedCircuit.name} />
									{selectedCircuit.places.map((placeData: Place, i: number) => (
										<div key={i}>
											<Card
												title={placeData.name as string}
												isEvent={false}
												color={placeData.principalCategory?.color}
												description={placeData.description}
												photoUrl={
													placeData.photos!.length > 0
														? placeData.photos![0].photoUrl
														: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
												}
												id={placeData.id}
												hasEvents={placeData.events?.length > 0}
												onClick={() => handleCardClick(placeData)}
												onClickTalk={function (): void {
													handleTalkClick(placeData.phone);
												}}
												onClickShare={function (): void {
													handleShareClick(placeData);
												}}
											/>
										</div>
									))}
								</>
							}
						/>
					) : (
						<></>
					)}
				</div>

				<IconButton
					onClick={() => {
						let dirs = 'https://www.google.com/maps/dir/';
						for (const place of list) {
							dirs += (place as Place).domicile + '/';
						}
						dirs = dirs.replace(' ', '+');
						window.open(dirs, '_blank', 'noreferrer');
					}}
					sx={{
						backgroundColor: '#8EA2A5',
						borderRadius: '50%',
						margin: '0.5rem',
						'&:hover': {
							backgroundColor: '#8EA2A5',
						},
						marginLeft: 'auto',
					}}
					size='medium'
				>
					<Directions
						style={{
							color: 'white',
							marginRight: '0px',
							marginLeft: 'auto',
						}}
					/>
				</IconButton>
				<div
					style={{
						top: 90,
						width: '95vw',
						flexDirection: 'row',
						alignItems: 'center',
						display: 'flex',
						position: 'absolute',
						maxWidth: '700px',
						zIndex: 2,
						backgroundColor: 'transparent',
						borderRadius: 20,
					}}
				>
					<div style={{ marginLeft: '75%', marginTop: -27 }}>
						<Tag text={t['circuits']} color={'#B88268'} />
					</div>
				</div>
			</div>

			{isLoading && list.length !== 0 ? (
				<Loading />
			) : (
				<>
					<GenericMap
						handleInfoWIndowClick={handleCardClick}
						places={list}
						selected={selectedPoint}
						onMarkerClick={(place, index) => handleMarkerClick(place, index)}
						centerCardIndex={selectedCardIndex}
						userLocation={userLocation}
					/>

					<Hidden mdUp>
						<CardCarousel
							cards={list}
							onCardClick={handleCardClick}
							onEventCardClick={handleEventCardClick}
							centerCardIndex={selectedCardIndex}
							onCardCentered={handleCardCentered}
						/>
					</Hidden>
					<Hidden mdDown>
						{list.length != 0 ? (
							<CardSidebar
								cards={list}
								onCardClick={handleCardClick}
								onEventCardClick={handleEventCardClick}
								onCardHover={handleCardHover}
								onFlyers={() => {}}
							/>
						) : (
							<></>
						)}
					</Hidden>
				</>
			)}
		</MainLayout>
	);
};

export default HomePage;
