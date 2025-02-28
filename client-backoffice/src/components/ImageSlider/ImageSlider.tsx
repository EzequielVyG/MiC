import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DeleteIcon from '@mui/icons-material/Delete';
import {
	Card,
	CardActionArea,
	CardMedia,
	IconButton,
	Stack,
	SxProps,
} from '@mui/material';
import React, { useState } from 'react';
import DialogConfirmDelete from '../Dialog/DialogConfirmDelete';

type ImageSliderProps = {
	images: string[];
	onDelete?: (index: number) => void;
	sx?: SxProps;
};

const ImageSlider: React.FC<ImageSliderProps> = ({ images, onDelete, sx }) => {
	const [currentImageIndex, setCurrentImageIndex] = useState(0);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const handleNextImage = () => {
		setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
	};

	const handlePrevImage = () => {
		setCurrentImageIndex((prevIndex) =>
			prevIndex === 0 ? images.length - 1 : prevIndex - 1
		);
	};

	const handleDeleteImage = () => {
		setIsDeleteDialogOpen(true);
	};

	const handleConfirmDelete = () => {
		if (onDelete) {
			onDelete(currentImageIndex);
		}
		setIsDeleteDialogOpen(false);
		setCurrentImageIndex(0);
	};

	return (
		<Card
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',

				border: '1px solid #ccc',
				mb: 2,
				cursor: 'pointer',
				width: '400px',
				height: '400px',
				overflow: 'hidden',
				...sx,
			}}
		>
			{/* DialogConfirmDelete para la eliminación */}
			<DialogConfirmDelete
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={handleConfirmDelete}
			/>
			<Stack direction='row' justifyContent='space-between' sx={{ p: 2 }}>
				<IconButton onClick={handlePrevImage}>
					<ArrowBackIcon />
				</IconButton>
				<IconButton onClick={handleDeleteImage}>
					<DeleteIcon />
				</IconButton>
				<IconButton onClick={handleNextImage}>
					<ArrowForwardIcon />
				</IconButton>
			</Stack>
			<CardActionArea sx={{ flexGrow: 1 }}>
				<div
					style={{
						height: '100%',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						overflow: 'auto',
					}}
				>
					<div
						style={{
							maxWidth: '100%',
							maxHeight: '100%',
							width: 'auto',
							height: 'auto',
						}}
					>
						<CardMedia
							component='img'
							style={{ objectFit: 'contain', width: '100%', height: '100%' }}
							image={images[currentImageIndex]}
							alt={`Image ${currentImageIndex}`}
						/>
					</div>
				</div>
			</CardActionArea>
		</Card>
	);
};

export default ImageSlider;
