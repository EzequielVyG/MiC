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
	title: string;
	message: string;
	cancelButtonText: string;
	confirmButtonText: string;
}

const DialogConfirmDelete: React.FC<DialogConfirmDeleteProps> = ({
	isOpen,
	onClose,
	onConfirm,
	title,
	message,
	cancelButtonText,
	confirmButtonText,
}) => {
	return (
		<Dialog open={isOpen} onClose={onClose}>
			<DialogTitle>{title}</DialogTitle>
			<DialogContent>
				<DialogContentText>{message}</DialogContentText>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color='primary'>
					{cancelButtonText}
				</Button>
				<Button onClick={onConfirm} color='primary'>
					{confirmButtonText}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

export default DialogConfirmDelete;
