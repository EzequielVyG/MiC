import React from 'react';
import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
} from '@mui/material';

interface DialogConfirmDeleteProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string; // Propiedad para personalizar el título del diálogo
	message: string; // Propiedad para personalizar el mensaje del diálogo
	cancelText: string; // Propiedad para personalizar el texto del botón de cancelar
	confirmText: string; // Propiedad para personalizar el texto del botón de eliminar
}

const DialogConfirmDelete: React.FC<DialogConfirmDeleteProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title, // Agregar título personalizable
	message, // Agregar mensaje personalizable
	cancelText, // Agregar texto del botón Cancelar personalizable
	confirmText, // Agregar texto del botón Eliminar personalizable
}) => {
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					{cancelText}
				</Button>
				<Button onClick={onConfirm} color='primary'>
					{confirmText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogConfirmDelete;
