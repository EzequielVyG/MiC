import Image from '@/components/Image/Image'; // Ajusta la importación según tu estructura
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

type ImageCarouselProps = {
	images: string[];
	maxWidth?: string; // Agregamos la prop maxWidth
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, maxWidth }) => {
	return (
		<Carousel>
			{images.map((image, index) => (
				<div
					key={index}
					style={{
						display: 'flex',
						justifyContent: 'center',
						alignSelf: 'center',
					}}
				>
					<Image
						src={image}
						alt={`Image ${index}`}
						maxWidth={maxWidth} // Pasamos la prop maxWidth al componente Image
					/>
				</div>
			))}
		</Carousel>
	);
};

export default ImageCarousel;
