import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import MyCard from '@/components/Card/Card';
import CardCarousel from '@/components/Card/CardCarousel';
import CardSidebar from '@/components/Card/CardSidebar';
import HomeDrawer from '@/components/Drawer/HomeDrawer';
import CarouselButtonStories from '@/components/ImageCarousel/CarouselButtonStories'; // Importa tu componente ImageCarousel
import CarouselStories from '@/components/ImageCarousel/CarouselStories';
import Loading from '@/components/Loading/Loading';
import GenericMap from '@/components/Map/GenericMap';
import { Category } from '@/features/Categories/category';
import { findAllCategoriesWithVigentEvents } from '@/features/Categories/hooks/useFindAllWithVigentEvents';
import { Event } from '@/features/Events/Event';
import { findByCategories } from '@/features/Events/hooks/useFindByCategories';
import { getFirst15VigentEvents } from '@/features/Events/hooks/useGetFirst15VigentEvents';
import { Place } from '@/features/Places/place';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
import useEventCategorySelected from '@/hooks/useEventCategorySelected';
import useEventList from '@/hooks/useEventList';
import useMyUser from '@/hooks/useMyUser';
import useSelectedEvent from '@/hooks/utils/useSelectedEvent';
import MainLayout from '@/layouts/MainLayout';
import en from '@/locale/en';
import es from '@/locale/es';
import { Autocomplete, Hidden, TextField } from '@mui/material';
import { useSession } from 'next-auth/react';
import ReactGA from 'react-ga4';
import Tag from '@/components/Tag/Tag';

const HomePage = () => {
	const router = useRouter();

	const { locale } = router;
	const t: any = locale === 'en' ? en : es;
	const { data: session } = useSession();

	const [isLoading, setIsLoading] = useState(true);
	const [categoryOptions, setCategoryOptions] = useState<Category[]>([]);

	const { categorySelected, setCategorySelected, firstTime, setFirstTime } =
		useEventCategorySelected();
	const { selectedEvent, setSelectedEvent } = useSelectedEvent();

	const [list, setList] = useState<Event[]>([]);
	const [flyers, setFlyers] = useState([]);
	const [showStories, setShowStories] = useState(false);
	const [storie, setStorie] = useState(0);
	const [isDrawerOpened, setIsDrawerOpened] = useState<boolean>(false);

	const [selectedPoint, setSelectedPoint] = useState<Event | null>(null);
	const [selectedCardIndex, setSelectedCardIndex] = useState<
		number | undefined
	>(0);

	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const [isFlyerShow, setIsFlyerShow] = useState(false);

	const [myUser, setMyUser] = useState<User | null>();
	const { setMyUser: setGlobalUser } = useMyUser();
	const { setEventList } = useEventList();

	async function getUser() {
		if (session?.user?.email) {
			const response = await getuserByEmail(session?.user?.email);
			if (response.data) {
				setMyUser(response.data);
				setGlobalUser(response.data);
				const filteredCategories = response.data.preferences?.categories.filter(
					(category: Category) => category.group === 'Eventos'
				);
				if (filteredCategories?.length > 0) {
					setCategorySelected(filteredCategories);
				}
			}
		}
	}

	useEffect(() => {
		setIsLoading(true);
		if (firstTime) {
			getUser();
			setFirstTime(false);
		}
		setIsLoading(true);
		fetchCategories();
		handleRequestLocation();
		setIsLoading(false);
	}, [myUser]);

	useEffect(() => {
		setIsLoading(true);
		fetchEventData();
		setIsLoading(false);
	}, [categorySelected, userLocation]);

	useEffect(() => {
		ReactGA.send({
			hitType: 'pageview',
			page: '/home/events',
			title: 'Visita a events',
		});
	}, []);

	useEffect(() => {
		fetchEventData();
	}, [categorySelected]);

	// let preferredEvents: any[] = [];
	// let categoryEvents = [];
	// let defaultEvents = [];

	// async function fetchPreferredEvents() {
	// 	try {
	// 		const preferenceCategories = myUser?.preferences?.categories;
	// 		const categoryIds =
	// 			preferenceCategories?.map((category) => category.id) || [];
	// 		const someEvents = (await findByCategories(categoryIds)).data;
	// 		preferredEvents = someEvents ? someEvents : [];
	// 	} catch (error) {
	// 		console.error('Error fetching places:', error);
	// 	}
	// }

	async function fetchEventData() {
		try {
			const categoryIds: string[] | null = categorySelected
				? categorySelected.map((category) => category.id)
				: null;

			const someEvents =
				categoryIds!.length > 0
					? (await findByCategories(categoryIds as string[])).data
					: (
							await getFirst15VigentEvents(
								userLocation?.lat as number,
								userLocation?.lng as number
							)
					  ).data;
			setList(someEvents);

			const flyers = someEvents
				.filter((e: { flyers: string | any[] }) => e.flyers.length > 0)
				.map((e: { id: any; title: any; flyers: any }) => ({
					id: e.id,
					title: e.title,
					flyers: e.flyers.map((flyer: { flyerUrl: any }) => flyer.flyerUrl),
				}));
			setFlyers(flyers);

			const index = selectedEvent
				? someEvents.findIndex((event: Event) => event.id === selectedEvent.id)
				: 0;
			setSelectedCardIndex(index);

			if (window.innerWidth < 768 && someEvents.length != 0) {
				if (someEvents[0].place) {
					setSelectedPoint(someEvents[0]);
				}
			}
		} catch (error) {
			console.error('Error fetching events:', error);
		}
	}

	// async function fetchEventData() {
	// 	try {
	// 		let someEvents = [];

	// 		await fetchPreferredEvents();

	// 		categoryEvents = categorySelected
	// 			? (await getByCategory(categorySelected.id)).data
	// 			: [];

	// 		defaultEvents = (await getFirst15VigentEvents()).data;

	// 		someEvents =
	// 			categoryEvents.length !== 0
	// 				? categoryEvents
	// 				: preferredEvents.length !== 0
	// 				? preferredEvents
	// 				: defaultEvents
	// 				? defaultEvents
	// 				: [];

	// 		console.log(someEvents);
	// 		setList(someEvents);
	// 		setList(someEvents);
	// 		const flyers = someEvents
	// 			.filter((e: { flyers: string | any[] }) => e.flyers.length > 0)
	// 			.map((e: { id: any; title: any; flyers: any }) => ({
	// 				id: e.id,
	// 				title: e.title,
	// 				flyers: e.flyers.map((flyer: { flyerUrl: any }) => flyer.flyerUrl),
	// 			}));
	// 		setFlyers(flyers);

	// 		const index = selectedEvent
	// 			? someEvents.findIndex((event: Event) => event.id === selectedEvent.id)
	// 			: 0;

	// 		setSelectedCardIndex(index);
	// 		if (window.innerWidth < 768 && someEvents.length != 0) {
	// 			if (someEvents[0].place) {
	// 				setSelectedPoint(someEvents[0]);
	// 			}
	// 		}
	// 	} catch (error) {
	// 		console.error('Error fetching events:', error);
	// 	}
	// }

	async function fetchCategories() {
		try {
			const categories = await findAllCategoriesWithVigentEvents();
			setCategoryOptions(categories.data);
		} catch (error) {
			console.error('Error fetching categories:', error);
		}
	}

	const handleCardClick = (event: Event) => {
		setEventList(list);
		router.push(
			`/events/detail/${event.id}
			`
		);
	};

	const handleMarkerClick = (event: Event | Place, cardIndex: number) => {
		setSelectedCardIndex(cardIndex);
		setSelectedEvent(event as Event);
	};

	const handleCardCentered = (index: number) => {
		setSelectedCardIndex(index); // Actualiza el índice de la tarjeta centrada
		const anEvent: Event = list[index];
		setSelectedEvent(anEvent);
		if (anEvent?.place) {
			setSelectedPoint(anEvent);
		}
	};

	const handleCardHover = (event: Event) => {
		setSelectedCardIndex(list.indexOf(event));
	};

	const onFlyersShow = (status: boolean) => {
		setIsFlyerShow(status);
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

	const handleCategoryChange = (event: any, newValue: Category[] | null) => {
		setCategorySelected(newValue);
		setSelectedCardIndex(0); // Actualiza el índice de la tarjeta centrada
		setSelectedEvent(null);
	};

	const handleStoryClick = (flyer: React.SetStateAction<number>) => {
		setStorie(flyer);
		setShowStories(true);
		setIsDrawerOpened(false);
	};

	const setOpened = () => {
		setIsDrawerOpened(!isDrawerOpened);
	};

	const handleShareClick = (card: any) => {
		if (navigator.share) {
			navigator
				.share({
					title: card.name,
					text: card.description,
					url: window.location.origin + `/events/detail/${card.id}`,
				})
				.then(() => console.log('Contenido compartido exitosamente'))
				.catch((error) => console.error('Error al compartir:', error));
		} else {
			console.log(
				'La función de compartir no está disponible en este navegador.'
			);
		}
	};

	const handleTalkClick = (phone: string) => {
		window.location.href = `tel:${phone}`;
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
				<div style={{ width: '100%' }}>
					<Autocomplete
						multiple
						limitTags={window.innerWidth < 768 ? 1 : 3}
						hidden={isFlyerShow}
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
					<div style={{ marginLeft: '75%', marginTop: -20 }}>
						{!isFlyerShow && <Tag text={t['events']} color={'#B88268'} />}
					</div>
				</div>

				<div style={{ justifyContent: 'center' }}>
					{list?.length != 0 ? (
						<HomeDrawer
							/* onCardClick={handleCardClick} */
							setIsOpened={setOpened}
							isOpened={isDrawerOpened}
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

									<CarouselButtonStories
										flyers={flyers}
										onFlyers={() => {}}
										onClick={(i: any) => {
											handleStoryClick(i);
										}}
									/>
									{/* <Title
										textTitle={
											categorySelected
												? categorySelected.name
												: t['upcomingevents']
										}
									/> */}
									<br />
									{list?.map((event: Event) => (
										<div key={event.id}>
											<MyCard
												eventToSubscribe={event}
												saveEventButton={true}
												title={event.name}
												description={event.place?.name ? event.place.name : ''}
												isEvent={true}
												color={'#984D98'}
												startDate={event.startDate}
												photoUrl={
													event.photos!.length > 0
														? event.photos![0].photoUrl
														: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
												}
												id={event.id}
												onClick={() => handleCardClick(event)}
												onClickTalk={function (): void {
													handleTalkClick(
														event.participants.length > 0
															? event.participants![0].organization?.phone
															: ''
													);
												}}
												onClickShare={function (): void {
													handleShareClick(event);
												}}
												phone={
													event.participants.length > 0
														? event.participants![0].organization?.phone
														: ''
												}
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
			</div>
			{showStories && (
				<CarouselStories
					initialIndex={storie}
					flyers={flyers}
					endFlyers={() => {
						setIsDrawerOpened(true);
						setShowStories(false);
					}}
				/>
			)}
			{isLoading && list?.length !== 0 ? (
				<Loading />
			) : (
				<>
					<GenericMap
						handleInfoWIndowClick={handleCardClick}
						places={list}
						selected={selectedPoint}
						onMarkerClick={(event, index) => handleMarkerClick(event, index)}
						centerCardIndex={selectedCardIndex}
						userLocation={userLocation}
					/>
					<Hidden mdUp>
						<CardCarousel
							cards={list}
							onEventCardClick={handleCardClick}
							centerCardIndex={selectedCardIndex}
							onCardCentered={handleCardCentered}
							onCardClick={() => {}}
						/>
					</Hidden>
					<Hidden mdDown>
						{list?.length != 0 ? (
							<CardSidebar
								cards={list}
								onCardClick={() => {}}
								onEventCardClick={handleCardClick}
								onCardHover={handleCardHover}
								flyers={flyers}
								onFlyers={onFlyersShow}
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
