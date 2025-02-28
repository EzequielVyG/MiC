import CardCarousel from '@/components/Card/CardCarousel';
import Loading from '@/components/Loading/Loading';
import GenericMap from '@/components/Map/GenericMap';
import MainLayout from '@/layouts/MainLayout';
import { Autocomplete, Hidden, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import Card from '@/components/Card/Card';
import CardSidebar from '@/components/Card/CardSidebar';
import HomeDrawer from '@/components/Drawer/HomeDrawer';
import { Category } from '@/features/Categories/category';
import { findAllCategoriesWithPlaces } from '@/features/Categories/hooks/useFindAllWithPlaces';
import { Event } from '@/features/Events/Event';
import { findAllByDistance } from '@/features/Places/hooks/useFindAllByDistanceQuery';
import { findByCategories } from '@/features/Places/hooks/useFindByCategories';
import { Place } from '@/features/Places/place';
/* import { User } from '@/features/Users/user'; */
import usePlaceCategorySelected from '@/hooks/usePlaceCategorySelected';
import usePlaceList from '@/hooks/usePlaceList';
import useSelectedPlace from '@/hooks/useSelectedPlace';
import useUserLocation from '@/hooks/useUserLocation';
import en from '@/locale/en';
import es from '@/locale/es';
import { useSession } from 'next-auth/react';
import ReactGA from 'react-ga4';
import { User } from '@/features/Users/user';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import Tag from '@/components/Tag/Tag';

const HomePage = () => {
	const router = useRouter();

	const { locale } = router;
	const t: any = locale === 'en' ? en : es;

	const { data: session } = useSession();
	const [isLoading, setIsLoading] = useState(true);
	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

	const { categorySelected, setCategorySelected, firstTime, setFirstTime } =
		usePlaceCategorySelected();
	const { selectedPlace, setSelectedPlace } = useSelectedPlace();
	const [list, setList] = useState<Place[]>([]);

	const [selectedPoint, setSelectedPoint] = useState<Place | null>(null);
	const [selectedCardIndex, setSelectedCardIndex] = useState<
		number | undefined
	>(undefined);

	const [, /* myUser */ setMyUser] = useState<User | null>();

	const { userLocation, setUserLocation } = useUserLocation();

	const { setPlaceList } = usePlaceList();

	async function getUser() {
		const categories = (await findAllCategoriesWithPlaces()).data;
		const initialCategories = categories.filter(
			(categoria: { name: string }) =>
				categoria.name === 'Atracciones turísticas'
		);
		if (session?.user?.email) {
			const response = await getuserByEmail(session?.user?.email);
			if (response.data) {
				setMyUser(response.data);
				const filteredCategories = response.data.preferences?.categories.filter(
					(category: Category) => category.group !== 'Eventos'
				);
				if (filteredCategories && filteredCategories?.length > 0) {
					setCategorySelected(filteredCategories);
				} else {
					setCategorySelected(initialCategories);
				}
			}
		} else {
			setCategorySelected(initialCategories);
		}
	}

	useEffect(() => {
		setIsLoading(true);
		if (firstTime) {
			getUser();
			setFirstTime(false);
		}
		setIsLoading(true);
		ReactGA.send({
			hitType: 'pageview',
			page: '/home/places',
			title: 'Visita a places',
		});
		fetchCategories();
		handleRequestLocation();
		setIsLoading(false);
	}, []);

	// useEffect(() => {
	// 	getUser();
	// }, [session]);

	useEffect(() => {
		setIsLoading(true);
		fetchPlaceData();
		setIsLoading(false);
	}, [categorySelected, userLocation]);

	function redirect(route: string) {
		const aPlace = list[selectedCardIndex as number];
		setSelectedPlace(aPlace);
		router.push(route);
	}

	async function fetchPlaceData() {
		try {
			const categoryIds: string[] | null = categorySelected
				? categorySelected.map((category) => category.id)
				: null;

			const somePlaces: Place[] =
				categoryIds?.length != 0
					? (
							await findByCategories(
								categoryIds as string[],
								userLocation?.lat as number,
								userLocation?.lng as number
							)
					  ).data
					: (
							await findAllByDistance(
								userLocation?.lat as number,
								userLocation?.lng as number
							)
					  ).data;
			setList(somePlaces);

			const index = selectedPlace
				? somePlaces.findIndex((place) => place.id === selectedPlace.id)
				: 0;

			setSelectedCardIndex(index);
			if (window.innerWidth < 768 && somePlaces.length != 0) {
				setSelectedPoint(somePlaces[index]);
			}

			// Solo cambiar en celular
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	}

	async function fetchCategories() {
		try {
			const categories = await findAllCategoriesWithPlaces();
			setCategoryOptions(categories.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

	const handleCardClick = (place: Place) => {
		setPlaceList(list);
		router.push(`/places/${place.id}`);
	};

	const handleEventCardClick = (event: Event) => {
		redirect(`/events/detail/${event.id}`);
	};

	const handleMarkerClick = (place: Place | Event, cardIndex: number) => {
		setSelectedCardIndex(cardIndex);
	};

	const handleCardCentered = async (index: number) => {
		setSelectedCardIndex(index); // Actualiza el índice de la tarjeta centrada
		const aPlace: Place | Event = list[index];
		setSelectedPoint(aPlace);
		setSelectedPlace(aPlace);
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
			{ enableHighAccuracy: true }
		);
	};

	const handleCategoryChange = (event: any, newValue: Category[] | []) => {
		setCategorySelected(newValue);
		setSelectedCardIndex(0); // Actualiza el índice de la tarjeta centrada
		setSelectedPlace(null);
	};

	const handleTalkClick = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};

	const handleShareClick = (card: any) => {
		if (navigator.share) {
			navigator
				.share({
					title: card.name,
					text: card.description,
					url:
						window.location.origin +
						(card.location
							? `/places/${card.id}`
							: `/events/detail/${card.id}`),
				})
				.then(() => console.log('Contenido compartido exitosamente'))
				.catch((error) => console.error('Error al compartir:', error));
		} else {
			console.log(
				'La función de compartir no está disponible en este navegador.'
			);
		}
	};

	return (
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
					backgroundColor: 'transparent',
					borderRadius: 20,
				}}
			>
				<div style={{ width: '100%', zIndex: 3 }}>
					<Autocomplete
						multiple
						limitTags={window.innerWidth < 768 ? 1 : 3}
						options={categoryOptions}
						getOptionLabel={(category) => category.name}
						value={categorySelected!}
						onChange={handleCategoryChange}
						sx={{
							backgroundColor: 'white',
							borderRadius: 20,
							border: 'none',
						}}
						renderInput={(params) => (
							<TextField
								variant='outlined'
								{...params}
								label={t['WhatAreYouLookingFor']}
								InputProps={{
									...params.InputProps,
									style: {
										borderWidth: 0,
										borderRadius: '20px',
									},
								}}
							/>
						)}
					/>
				</div>
			</div>
			<div
				style={{
					top: 150,
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
				<div style={{ marginLeft: '75%' }}>
					<Tag text={t['places']} color={'#B88268'} />
				</div>
			</div>
			<div style={{ position: 'fixed', marginTop: '150px', zIndex: 3 }}>
				{list?.length != 0 ? (
					<HomeDrawer
						content={
							<>
								<Autocomplete
									multiple
									limitTags={window.innerWidth < 768 ? 1 : 3}
									options={categoryOptions}
									getOptionLabel={(category) => category.name}
									value={categorySelected!}
									onChange={handleCategoryChange}
									sx={{
										marginTop: '10px',
										backgroundColor: 'white',
										borderRadius: 20,
										border: 'none',
										margin: 2,
									}}
									renderInput={(params) => (
										<TextField
											{...params}
											label={t['WhatAreYouLookingFor']}
											InputProps={{
												...params.InputProps,
												style: {
													borderWidth: 0,
													borderRadius: '20px',
												},
											}}
										/>
									)}
								/>
								{/* <Title
									textTitle={categorySelected ? categorySelected.name : ''}
								/> */}
								{list?.map((placeData: Place, i: number) => (
									<div key={i}>
										<Card
											title={placeData.name as string}
											description={placeData.domicile}
											isEvent={false}
											color={placeData.principalCategory?.color}
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
											phone={placeData.phone}
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
						{list?.length != 0 ? (
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
