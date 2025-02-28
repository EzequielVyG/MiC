import Image from "@/components/Image/Image"; // Ajusta la importación según tu estructura
import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

type ImageCarouselProps = {
  images: string[];
  maxWidth?: string;
};

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, maxWidth }) => {
  return (
    <Carousel showThumbs={false}>
      {images.map((image, index) => (
        <div key={index}>
          <Image src={image} alt={`Image ${index}`} maxWidth={maxWidth} />
        </div>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
