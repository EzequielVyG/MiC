import { Event } from '@/features/Events/Event';
import { Place } from '@/features/Places/place';
import useMyUser from '@/hooks/useMyUser';
import { useRouter } from 'next/router';
import React, { useRef } from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import MyCard from './Card';

const CardCarousel: React.FC<{
	cards?: any[];
	eventCards?: Event[];
	onCardClick: (place: Place) => void;
	onEventCardClick: (event: Event) => void;
	onEventIconClick?: (place: Place) => void;
	type?: 'Place' | 'Event';
	centerCardIndex: number | undefined;
	onCardCentered: (index: number) => void;
}> = ({
	cards = [],
	onCardClick,
	onEventCardClick,
	centerCardIndex,
	onCardCentered,
}) => {
	const sliderRef = useRef<Carousel>(null);
	const router = useRouter();
	const { myUser } = useMyUser();

	const handleSlideChange = (index: number) => {
		onCardCentered(index);
	};

	const handleTalkClick = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};

	const handleShareClick = (placeData: any) => {
		if (navigator.share) {
			const url = placeData.location
				? `${window.location.origin}/places/${placeData.id}`
				: `${window.location.origin}/events/detail/${placeData.id}`;
			navigator
				.share({
					title: placeData.name,
					text: placeData.description,
					url: url,
				})
				.then(() => console.log('Contenido compartido exitosamente'))
				.catch((error) => console.error('Error al compartir:', error));
		} else {
			console.log(
				placeData.location
					? `${window.location.origin}/places/${placeData.id}`
					: `${window.location.origin}/events/detail/${placeData.id}`
			);
			console.log(
				'La función de compartir no está disponible en este navegador.'
			);
		}
	};

	const handleEventIconClick = (place: Place) => {
		router.push({
			pathname: '/events',
			query: { place_id: place.id },
		});
		// onEventIconClick(place);
	};

	return (
		<div
			style={{
				position: 'fixed',
				bottom: 0,
				width: '98%',
				height: '22%',
				background: 'transparent',
			}}
		>
			{cards.length > 0 && (
				<Carousel
					ref={sliderRef}
					selectedItem={centerCardIndex}
					onChange={handleSlideChange}
					emulateTouch={true}
					showStatus={false}
					showIndicators={false}
					showThumbs={false}
					centerMode
				>
					{cards!.map((card) => (
						<div key={card.id}>
							{card.location ? (
								<MyCard
									onClick={() => onCardClick(card)}
									onClickTalk={function (): void {
										handleTalkClick(card.phone);
									}}
									onClickShare={function (): void {
										handleShareClick(card);
									}}
									onClickEvents={() => handleEventIconClick(card)}
									{...card}
									title={card.name!}
									isEvent={false}
									color={card.principalCategory?.color}
									description={card.description}
									hasEvents={card.events?.length > 0}
									photoUrl={
										card.photos.length > 0
											? card.photos![0].photoUrl
											: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
									}
								/>
							) : (
								// {/* TODO: reemplazar por la carta de evento  */ }
								<MyCard
									/* user={user} */
									eventToSubscribe={card}
									saveEventButton={true}
									isEvent={true}
									color={'#984D98'}
									isSaved={
										myUser?.favoriteEvents?.findIndex(
											(c) => c.id === card.id
										) !== -1
									}
									onClick={() => onEventCardClick(card)}
									onClickTalk={function (): void {
										handleTalkClick(card.participants.length>0 ? card.participants![0].organization?.phone : '');
									}}
									onClickShare={function (): void {
										handleShareClick(card);
									}}
									{...card}
									title={card.name!}
									startDate={card.startDate}
									photoUrl={
										card.photos.length > 0
											? card.photos![0].photoUrl
											: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
									}
									phone={card.participants.length>0 ? card.participants![0].organization?.phone : ''}
								/>
							)}
						</div>
					))}
				</Carousel>
			)}
		</div>
	);
};

export default CardCarousel;
