import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
} from '@mui/material';

type DialogLabelProps = {
    text: string;
    dialogTitle: string;
    onSave: (message: string) => void;
    open: boolean; // Prop para determinar si el diálogo debe estar abierto o cerrado
    onClose: () => void; // Prop para manejar el cierre del diálogo
};

const DialogLabel: React.FC<DialogLabelProps> = ({
    dialogTitle,
    onSave,
    open,
    onClose,
}) => {
    const [message, setMessage] = useState('');

    const handleSave = () => {
        onSave(message);
        setMessage('');
        onClose(); // Cierra el diálogo después de guardar
    };

    const handleClose = () => {
        onClose(); // Cierra el diálogo sin guardar
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>{dialogTitle}</DialogTitle>
            <DialogContent>
                <TextField
                    multiline
                    rows={5}
                    autoFocus
                    margin="dense"
                    label="Cuerpo del email"
                    fullWidth
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancelar
                </Button>
                <Button onClick={handleSave} color="primary">
                    Enviar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DialogLabel;
