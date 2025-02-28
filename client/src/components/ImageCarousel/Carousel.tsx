/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

type ImageCarouselProps = {
    images: string[];
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
    return (
        <Carousel
            showThumbs={false}
            showStatus={false}
            // infiniteLoop={true}
            // autoPlay={true}
            // interval={5000}
            dynamicHeight={true}
        >
            {images.map((photo, index) => (
                <div key={index}>
                    <img
                        src={photo}
                        alt={`Foto ${index}`}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 20
                        }}
                    />
                </div>
            ))}
        </Carousel>
    );
};

export default ImageCarousel;
