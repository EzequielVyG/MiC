import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import CallIcon from "@mui/icons-material/Call";
import RoomIcon from '@mui/icons-material/Room';

const colors = [
  {
    name: 'Cancelado',
    color: "rgba(255, 105, 97, 0.5)", // Rojo claro y opaco
  },
  {
    name: 'Pendiente',
    color: "rgba(230, 230, 250, 0.5)", // Lavanda y opaco
  },
  {
    name: 'Activo',
    color: "rgba(164, 211, 224, 0.5)", // Azul claro y opaco
  },
  {
    name: 'Rechazado',
    color: "rgba(255, 182, 193, 0.5)", // Rosa claro y opaco
  },
  {
    name: 'En revisión',
    color: "rgba(144, 238, 144, 0.5)", // Verde claro y opaco
  },
  {
    name: 'En espera',
    color: "rgba(255, 215, 0, 0.5)", // Amarillo claro y opaco
  },
];

type CardProps = {
  title: string;
  address: string;
  phone: string;
  status: string;
  photoUrl?: string;
  id?: string;
  onClick?: () => void; // Nueva prop para la función de manejo del clic
};
const GenericCard: React.FC<CardProps> = ({
  title,
  address,
  phone,
  status,
  photoUrl,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        borderRadius: 2,
        border: "1px solid #ccc",
        mb: 2,
        cursor: "pointer",
        width: "80vw",
        minWidth: "100px",
        maxWidth: "400px",
        transition: "transform 0.3s ease",
        ...(isHovered && { boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" }),
        display: "flex",
        flexDirection: "column",
        boxShadow: "none",
      }}
    >
      <CardActionArea>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Alinea los elementos en la misma fila
            alignItems: "center",
            padding: "8px 16px 0 16px",
          }}
        >
          <div>
            <Typography variant="h6" component="div" fontWeight="bold">
              {title}
            </Typography>
          </div>
          <div
            style={{
              backgroundColor: colors.find((c) => c.name === status)?.color,
              borderRadius: "15px",
              padding: "2px 5px 0px 5px",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              {status}
            </Typography>
          </div>
        </Box>

        <CardContent>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <RoomIcon style={{ color: "#8EA2A5", margin: 5 }} /> {/* Icono en blanco */}
            <Typography variant="body2" color="text.secondary">
              {address}
            </Typography>
          </div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <CallIcon style={{ color: "#8EA2A5", margin: 5 }} /> {/* Icono en blanco */}
            <Typography variant="body2" color="text.secondary">
              {phone}
            </Typography>
          </div>
        </CardContent>
        {photoUrl ? (
          <>
            <CardMedia
              component="img"
              height="140"
              image={photoUrl}
              alt={title}
              sx={{ objectFit: "cover", mt: "auto" }}
            />
          </>
        ) : (
          <></>
        )}
      </CardActionArea>
    </Card>

  );
};

export default GenericCard;
