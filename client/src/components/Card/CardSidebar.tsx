import { Event } from '@/features/Events/Event';
import { Place } from '@/features/Places/place';
import useMyUser from '@/hooks/useMyUser';
import router from 'next/router';
import React, { useState } from 'react';
import CarouselButtonStories from '../ImageCarousel/CarouselButtonStories';
import CarouselStories from '@/components/ImageCarousel/CarouselStories';
import MyCard from './Card';

const CardSidebar: React.FC<{
	cards?: any[];
	eventCards?: Event[];
	onCardClick: (place: Place) => void;
	onEventCardClick: (event: Event) => void;
	onCardHover: (place: Place & Event) => void;
	flyers?: any;
	onFlyers: (status: boolean) => void;
}> = ({
	cards = [],
	onCardClick,
	onEventCardClick,
	onCardHover,
	flyers,
	onFlyers,
}) => {
	const handleTalkClick = (phone: string) => {
		window.location.href = `tel:${phone}`;
	};
	const [showStories, setShowStories] = useState(false);
	const [storie, setStorie] = useState(0);

	const { myUser } = useMyUser();
	const handleStoryClick = (flyer: React.SetStateAction<number>) => {
		setStorie(flyer);
		setShowStories(true);
	};

	const handleShareClick = (card: any) => {
		if (navigator.share) {
			const url = card.location
				? `${window.location.origin}/places/${card.id}`
				: `${window.location.origin}/events/detail/${card.id}`;
			navigator
				.share({
					title: card.name,
					text: card.description,
					url: url,
				})
				.then(() => console.log('Contenido compartido exitosamente'))
				.catch((error) => console.error('Error al compartir:', error));
		} else {
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
				height: '82%',
				top: '120px',
				left: 0,
				width: '100px',
				right: '68%',
				backgroundColor: 'rgba(211, 209, 211, 0.5)',
				borderRadius: 8,
				margin: 10,
				zIndex: 1,
				minWidth: '300px',
			}}
		>
			{flyers ? (
				<>
					{' '}
					{showStories && (
						<CarouselStories
							initialIndex={storie}
							flyers={flyers}
							endFlyers={() => {
								onFlyers(false);
								setShowStories(false);
							}}
						/>
					)}
					<CarouselButtonStories
						flyers={flyers}
						onFlyers={onFlyers}
						onClick={(i: any) => {
							handleStoryClick(i);
						}}
					/>
				</>
			) : (
				<></>
			)}

			<div
				style={{
					position: 'absolute',
					left: 0,
					width: '100%',
					height: '100%',
					overflowY: 'auto',
					overflowX: 'hidden',
					background: 'transparent',
					display: 'flex',
					marginBottom: '100px',
					scrollbarWidth: 'none',
					minWidth: '300px',
				}}
			>
				<div style={{ display: 'flex', flexDirection: 'column' }}>
					{cards.map((card) => (
						<div
							key={card.id}
							style={{
								marginBottom: '5px',
								cursor: 'pointer',
							}}
							onMouseEnter={() => {
								onCardHover(card);
							}}
						>
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
									description={card.description}
									color={card.principalCategory?.color}
									hasEvents={card.events?.length > 0}
									photoUrl={
										card.photos.length > 0
											? card.photos![0].photoUrl
											: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
									}
								/>
							) : (
								<MyCard
									eventToSubscribe={card}
									color={'#984D98'}
									isSaved={
										myUser?.favoriteEvents?.findIndex(
											(c) => c.id === card.id
										) !== -1
									}
									saveEventButton={true}
									onClick={() => onEventCardClick(card)}
									onClickTalk={function (): void {
										handleTalkClick(card.phone);
									}}
									onClickShare={function (): void {
										handleShareClick(card);
									}}
									{...card}
									title={card.name!}
									isEvent={true}
									startDate={card.startDate}
									hasEvents={card.events?.length > 0}
									photoUrl={
										card.photos.length > 0
											? card.photos![0].photoUrl
											: 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg'
									}
								/>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default CardSidebar;
