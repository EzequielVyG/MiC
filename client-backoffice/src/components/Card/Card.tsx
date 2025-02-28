import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  SxProps,
} from "@mui/material";
import React, { useState } from "react";

type CardProps = {
  title: string;
  content: string;
  photoUrl?: string;
  id?:string;
  onClick?: () => void; // Nueva prop para la función de manejo del clic
  sx?: SxProps;
};
const MyCard: React.FC<CardProps> = ({
  title,
  content,
  photoUrl,
  onClick,
  sx,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: "flex",
        flexDirection: "column",
        border: "1px solid #ccc",
        mb: 2,
        cursor: "pointer",
        transform: isHovered ? "scale(1.05)" : "scale(1)", // Agranda un poco la tarjeta al pasar el mouse por encima
        transition: "transform 0.3s ease", // Agrega una transición suave
        ...sx,
      }}
    >
      <CardActionArea>
        <CardContent>
          <div style={{ fontWeight: "bold", fontSize: "1.2rem" }}>{title}</div>
          <div>{content}</div>
        </CardContent>
        <CardMedia
          component="img"
          height="140"
          image={photoUrl}
          alt={title}
          sx={{ objectFit: "cover", mt: "auto" }}
        />
      </CardActionArea>
    </Card>
  );
};

export default MyCard;
