import React from 'react';
import LogoColor from './LogoTypes';
import Image from 'next/image';

type LogoProps = {
	color: LogoColor;
	height?: number; // Nueva prop para el tamaño de la imagen
	width?: number; // Nueva prop para el tamaño de la imagen
};

const Logo: React.FC<LogoProps> = ({ color, width, height }) => {
	return (
		<Image
			priority
			src={require(`./muestras logo mic_MANDA-${color}.svg`)}
			alt='Logo de MIC'
			width={width} // Proporcionar el tamaño deseado
			height={height} // Proporcionar el tamaño deseado
		/>
	);
};

export default Logo;
