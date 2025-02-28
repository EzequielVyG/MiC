import en from "@/locale/en";
import es from "@/locale/es";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useState } from "react";

type CardProps = {
  title: string;
  description: string;
  status?: string;
  startDate: string;
  endDate: string;
  price: string;
  minors: string;
  photoUrl?: string;
  id?: string;
  onClick?: () => void; // Nueva prop para la función de manejo del clic
};
const CardEvent: React.FC<CardProps> = ({
  title,
  description,
  status,
  startDate,
  endDate,
  price,
  minors,
  photoUrl,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();
  const { locale } = router;
  const t: any = locale === "en" ? en : es;

  const colors = [
    {
      name: t["estadosEvento"]["Cancelado"],
      color: "rgba(255, 105, 97, 0.5)", // Rojo claro y opaco
    },
    {
      name: t["estadosEvento"]["Borrador"],
      color: "rgba(192, 192, 192, 0.5)", // Gris claro y opaco
    },
    {
      name: t["estadosEvento"]["Finalizado"],
      color: "rgba(164, 211, 224, 0.5)", // Azul claro y opaco
    },
    {
      name: t["estadosEvento"]["En progreso"],
      color: "rgba(144, 238, 144, 0.5)", // Verde claro y opaco
    },
    {
      name: t["estadosEvento"]["Pospuesto"],
      color: "rgba(255, 165, 0, 0.5)", // Naranja claro y opaco (cambiado de verde tirando a naranja)
    },
    {
      name: t["estadosEvento"]["Programado"],
      color: "rgba(255, 255, 102, 0.5)", // Amarillo pastel y opaco (más pastel)
    },
    {
      name: t["estadosEvento"]["Pendiente"],
      color: "rgba(230, 230, 250, 0.5)", // Lavanda y opaco
    },
    {
      name: "",
      color: "#C8C7F7", //Violeta lavado, se muestra en el detalle de un lugar
    },
  ];

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
            padding: "8px 16px 8px 16px",
            backgroundColor: colors.find((c) => c.name === status)?.color,
          }}
        >
          <div>
            <Typography variant="h6" component="div" fontWeight="bold">
              {title}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="text.secondary">
              {status}
            </Typography>
          </div>
        </Box>

        <CardContent>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              {description.length > 40
                ? `${description.substring(0, 40)}...`
                : description}
            </Typography>
          </div>
          {startDate && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EventAvailableIcon style={{ color: "#8EA2A5", margin: 5 }} />{" "}
              {/* Icono en blanco */}
              <Typography variant="body2" color="text.secondary">
                {startDate}
              </Typography>
            </div>
          )}

          {endDate && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <EventBusyIcon style={{ color: "#8EA2A5", margin: 5 }} />{" "}
              {/* Icono en blanco */}
              <Typography variant="body2" color="text.secondary">
                {endDate}
              </Typography>
            </div>
          )}
        </CardContent>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between", // Alinea los elementos en la misma fila
            alignItems: "center",
            padding: "8px 16px 0 16px",
          }}
        >
          <div>
            <Typography variant="caption" color="text.secondary">
              {minors}
            </Typography>
          </div>
          <div>
            <Typography variant="caption" color="text.secondary">
              {price}
            </Typography>
          </div>
        </Box>

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

export default CardEvent;
