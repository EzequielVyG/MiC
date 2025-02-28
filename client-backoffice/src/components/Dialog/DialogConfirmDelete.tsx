import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

  
  interface DialogConfirmDeleteProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
  }
  
  const DialogConfirmDelete: React.FC<DialogConfirmDeleteProps> = ({
    isOpen,
    onClose,
    onConfirm,
  }) => {
    return (
      <Dialog open={isOpen} onClose={onClose}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={onConfirm} color="primary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
  export default DialogConfirmDelete;