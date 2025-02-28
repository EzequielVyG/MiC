import { Button, SxProps } from "@mui/material";
import React from "react";

type ButtonProps = {
  label?: string; // Puedes quitar la propiedad label si vas a usar children
  onClick?: (e: any) => void;
  color?: "inherit" | "primary" | "secondary";
  variant?: "text" | "outlined" | "contained";
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  sx?: SxProps;
  href?: string;
  icon?: React.ReactNode; // Cambiamos el nombre de la prop a "icon"
  children?: React.ReactNode; // Agregamos la prop children
};

const NavBarButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  color = "primary",
  variant = "text",
  type = "button",
  disabled = false,
  sx,
  children, // Agregamos children aquí
  href,
  icon, // Cambiamos el nombre de la prop a "icon"
}) => {
  return (
    <Button
      type={type}
      color={color}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      sx={{ ...sx, backgroundColor: "white", color: "#999999" }}
      href={href}
      endIcon={icon ? icon : null} // Mostrar el ícono si se proporciona
    >
      {label || children}{" "}
      {/* Usamos label o children según lo que esté disponible */}
    </Button>
  );
};

export default NavBarButton;
