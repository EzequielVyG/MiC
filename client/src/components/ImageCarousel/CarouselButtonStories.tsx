import React from 'react';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ButtonStory from '../Button/ButtonStory';

type CarouselButtonStoriesProps = {
	flyers: any;
	onFlyers: (status: boolean) => void;
	sx?: any;
	onClick: (i: any) => void;
};

const storyContainerStyle = {
	overflowX: 'auto',
	whiteSpace: 'nowrap',
	display: 'flex',
	gap: '2px',
} as React.CSSProperties;

const CarouselButtonStories: React.FC<CarouselButtonStoriesProps> = ({
	flyers,
	onFlyers,
	sx,
	onClick,
}) => {
	const handleStoryClick = () => {
		onFlyers(true);
	};

	return (
		<div style={storyContainerStyle}>
			{flyers.map((flyer: any, i: number) => {
				return (
					<div key={i} style={{ minWidth: '70px' }}>
						<ButtonStory
							sx={sx}
							imageUrl={flyer.flyers[0]}
							onClick={() => {
								handleStoryClick(), onClick(i);
							}}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default CarouselButtonStories;
