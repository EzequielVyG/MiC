/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import Label from '../Label/Label';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import IconButton from '@mui/material/IconButton';
import ShareIcon from '@mui/icons-material/Share';
import { Button, useMediaQuery } from '@mui/material';
import Tag from '../Tag/Tag';

const CustomImageCarousel: React.FC<{ images: string[] }> = ({ images }) => {
	return (
		<div
			style={{
				display: 'flex',
				overflowX: 'auto',
				whiteSpace: 'nowrap',
				margin: '0 -2px',
			}}
		>
			{images.map((image, index) => (
				<div
					key={index}
					style={{
						display: 'inline-block',
						margin: '0 8px',
					}}
				>
					<img
						src={image}
						alt={`Image ${index}`}
						style={{
							width: '130px',
							height: '180px',
							objectFit: 'cover',
							borderRadius: '10px',
						}}
					/>
				</div>
			))}
		</div>
	);
};

type CardProps = {
	id?: string;
	title: string;
	description: string;
	images: string[];
	category: string;
	color?: string;
	cantPlaces?: number;
	onClick: () => void;
	onClickShare: () => void;
};

const MyCard: React.FC<CardProps> = ({
	title,
	description,
	images,
	category,
	color,
	cantPlaces,
	onClick,
	onClickShare,
}) => {
	const [isHovered, setIsHovered] = useState(false);
	const isDesktop = useMediaQuery('(min-width: 768px)');
	const [showFullDescription, setShowFullDescription] = useState(false);
	const maxDescriptionLength = 150;

	const toggleDescription = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation(); // Evitar que el clic se propague al contenedor Card
		setShowFullDescription(!showFullDescription);
	};

	const cardStyle: { [key: string]: string | number } = {
		display: 'flex',
		flexDirection: 'column',
		cursor: 'pointer',
		transform: isHovered ? 'scale(1.05)' : 'scale(1)',
		transition: 'transform 0.3s ease',
		backgroundColor: '#F3F5F6',
		borderRadius: 5,
		margin: '1rem',
		boxShadow: 'none',
	};

	if (isDesktop) {
		cardStyle['maxWidth'] = '500px'; // Ancho máximo en modo escritorio
	} else {
		cardStyle['maxWidth'] = '300px'; // Ancho máximo en dispositivos móviles
	}

	// Verificar si solo hay una imagen
	const isSingleImage =
		images.length === 1 || images.every((url, index, arr) => url === arr[0]);

	return (
		<Card
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={onClick}
			sx={cardStyle}
			style={{
				width: '100%',
				minHeight: '350px',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			<CardActionArea>
				<CardContent style={{ textAlign: 'center' }}>
					<div
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-evenly',
						}}
					>
						<Label id={'card_title'} text={title} variant='h6' />
					</div>
					<div>
						<Label
							id={'card_description'}
							text={
								showFullDescription
									? description
									: description.length > maxDescriptionLength
									? `${description.slice(0, maxDescriptionLength)}...`
									: description
							}
						/>
						{description.length > maxDescriptionLength && (
							<Button
								sx={{ fontSize: 12, color: '#999999', fontWeight: 'bold' }}
								onClick={toggleDescription}
							>
								{showFullDescription ? 'Ver menos' : 'Ver más'}
							</Button>
						)}
					</div>
				</CardContent>
			</CardActionArea>
			{isSingleImage ? (
				<CustomImageCarousel images={images.slice(0, 1)} />
			) : (
				<div
					style={{
						display: 'flex',
						overflowX: 'auto',
						whiteSpace: 'nowrap',
						marginBottom: '5px',
						width: '98%',
					}}
				>
					{images.map((image, index) => (
						<div key={index} style={{ flex: '0 0 auto' }}>
							<CustomImageCarousel images={[image]} />
						</div>
					))}
				</div>
			)}
			{cantPlaces && (
				<div
					style={{
						backgroundColor: '#F3F5F6',
						borderRadius: 5,
						padding: 5,
						margin: 10,
						boxShadow: 'none',
					}}
				>
					<Tag text={cantPlaces + ' lugares'} />
					&nbsp;
					<IconButton
						onClick={(event) => {
							event.stopPropagation(); // Evitar que el clic se propague al contenedor Card
							onClickShare();
						}}
						sx={{
							backgroundColor: '#8EA2A5',
							borderRadius: '50%',
							'&:hover': {
								backgroundColor: '#8EA2A5',
							},
						}}
						size='small'
					>
						<ShareIcon style={{ color: 'white' }} />
					</IconButton>
				</div>
			)}
			<Tag text={category} color={color} />
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					backgroundColor: '#F3F5F6',
					borderRadius: 5,
					padding: 5,
					margin: 10,
					boxShadow: 'none',
				}}
			>
				<div
					style={{
						display: 'flex',
					}}
				></div>
				<div
					style={{
						padding: 1,
					}}
				></div>
			</div>
		</Card>
	);
};

export default MyCard;
