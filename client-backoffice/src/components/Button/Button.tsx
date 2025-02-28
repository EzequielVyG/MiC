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
  icon?: React.ReactNode;
  startIcon?: React.ReactNode;
  children?: React.ReactNode; // Agregamos la prop children
};

const MyButton: React.FC<ButtonProps> = ({
  label,
  onClick,
  color = "primary",
  variant = "contained",
  type = "button",
  disabled = false,
  sx,
  children, // Agregamos children aquí
  href,
  icon,
  startIcon
}) => {
  return (
    <Button
      type={type}
      color={color}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      sx={sx}
      href={href}
      endIcon={icon ? icon : null}
      startIcon={startIcon ? startIcon : null}
    >
      {label || children}{" "}
      {/* Usamos label o children según lo que esté disponible */}
    </Button>
  );
};

export default MyButton;
