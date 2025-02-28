import React from "react";

type ImageProps = {
    src: string;
    alt: string;
    className?: string;
    maxWidth?: string; // Nueva prop para ajustar el ancho máximo
};

const MyImage: React.FC<ImageProps> = ({ src, alt, className, maxWidth }) => {
    const imgStyle: React.CSSProperties = {
        maxWidth: maxWidth || "100%", // Si no se proporciona maxWidth, usa el 100%
    };

    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} className={className} style={imgStyle} />;
};

export default MyImage;
