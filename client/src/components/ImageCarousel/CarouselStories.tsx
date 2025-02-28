import React, { useState, useEffect, CSSProperties } from 'react';
import Stories from 'react-insta-stories';
import ButtonStory from '../Button/ButtonStory';
import CloseIcon from '@mui/icons-material/Close';

const overlayStyle: CSSProperties = {
	position: 'fixed',
	top: 0,
	left: 0,
	width: '100%',
	height: '100%',
	backgroundColor: 'rgba(0, 0, 0, 0.8)',
	zIndex: 999,
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	alignItems: 'center',
};

const storiesContainerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
};

const buttonContainerStyle: CSSProperties = {
	display: 'flex',
	flexDirection: 'row',
	overflowX: 'auto',
	whiteSpace: 'nowrap',
	gap: '2px',
	width: '95vw',
	margin: '3%',
	justifyContent: 'center', // Centra los botones y el contenido horizontalmente
};

const closeButtonStyle: CSSProperties = {
	position: 'absolute',
	top: '10px',
	right: '10px',
	cursor: 'pointer',
};

const StoriesComponent: React.FC<any> = ({
	flyers,
	initialIndex,
	endFlyers,
}) => {
	const [currentStory, setCurrentStory] = useState(initialIndex);
	const [currentFlyerStory, setCurrentFlyerStory] = useState(0);

	const handleCloseClick = () => {
		endFlyers();
	};

	const handleButtonClick = (clickedIndex: number) => {
		setCurrentFlyerStory(0);
		setCurrentStory(clickedIndex);
	};

	const handleButtonClickNext = () => {
		if (currentFlyerStory < flyers[currentStory].flyers.length - 1) {
			setCurrentFlyerStory(currentFlyerStory + 1);
		} else {
			if (currentStory < flyers.length - 1) {
				setCurrentStory(currentStory + 1);
				setCurrentFlyerStory(0);
			} else {
				endFlyers();
			}
		}
	};

	const handleButtonClickPrevius = () => {
		if (currentFlyerStory > 0) {
			setCurrentFlyerStory(currentFlyerStory - 1);
		} else {
			if (currentStory > 0) {
				setCurrentStory(currentStory - 1);
				setCurrentFlyerStory(0);
			} else {
				endFlyers();
			}
		}
	};

	useEffect(() => {
		const handleStoryEnd = () => {
			if (currentFlyerStory < flyers[currentStory].flyers.length - 1) {
				setCurrentFlyerStory(currentFlyerStory + 1);
			} else {
				if (currentStory < flyers.length - 1) {
					setCurrentStory(currentStory + 1);
					setCurrentFlyerStory(0);
				} else {
					endFlyers();
				}
			}
		};

		const intervalId = setInterval(handleStoryEnd, 5000);

		return () => {
			clearInterval(intervalId);
		};
	}, [currentStory, currentFlyerStory, flyers, endFlyers]);

	const numVisibleButtons = 5; // Cantidad de botones visibles a la vez
	const startIndex = Math.max(
		currentStory - Math.floor(numVisibleButtons / 2),
		0
	);
	const endIndex = Math.min(startIndex + numVisibleButtons, flyers.length);

	const visibleFlyers = flyers.slice(startIndex, endIndex);

	return (
		<div style={overlayStyle}>
			<div style={storiesContainerStyle}>
				<div style={closeButtonStyle} onClick={handleCloseClick}>
					<CloseIcon />
				</div>
				<div className='button-container' style={buttonContainerStyle}>
					{visibleFlyers.map((flyer: any, i: number) => (
						<div key={i} style={{ minWidth: '70px', position: 'relative' }}>
							<ButtonStory
								imageUrl={flyer.flyers[0]}
								onClick={() => handleButtonClick(i + startIndex)}
								isActive={i + startIndex === currentStory}
							/>
						</div>
					))}
				</div>
				<Stories
					stories={flyers[currentStory].flyers.map((url: string) => ({
						url,
						type: 'image',
						duration: 5000,
					}))}
					currentIndex={currentFlyerStory}
					onNext={handleButtonClickNext}
					onPrevious={handleButtonClickPrevius}
				/>
			</div>
		</div>
	);
};

export default StoriesComponent;
