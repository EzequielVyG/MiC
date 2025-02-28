/* eslint-disable @next/next/no-img-element */
import { Button, SxProps } from "@mui/material";
import React from "react";

type ButtonStoryProps = {
    onClick?: (e: any) => void;
    disabled?: boolean;
    sx?: SxProps;
    imageUrl: string;
    isActive?: boolean;
};

const buttonStyles = {
    borderRadius: "50%",
    padding: 0,
    minWidth: "auto",
    border: "2px solid transparent",
    boxShadow: "none",
    borderColor: "#C7ABC9",
};

const activeButtonStyle = {
    backgroundColor: 'lightblue',
};

const inactiveButtonStyle = {
    filter: 'grayscale(100%)', // Desaturar botones inactivos
};

const ButtonStory: React.FC<ButtonStoryProps> = ({
    onClick,
    disabled = false,
    sx,
    imageUrl,
    isActive = true,
}) => {
    return (
        <Button
            variant="contained"
            onClick={onClick}
            disabled={disabled}
            sx={{
                ...buttonStyles,
                ...(isActive ? activeButtonStyle : inactiveButtonStyle),
                ...sx,
            }}
        >
            <div
                style={{
                    width: "60px",
                    height: "60px",
                    overflow: "hidden",
                }}
            >
                <img
                    src={imageUrl}
                    alt="Story"
                    style={{
                        borderRadius: "50%",
                        width: "100%",
                        height: "100%",
                        filter: isActive ? 'none' : 'grayscale(100%)', // Aplicar escala de grises en botones inactivos
                    }}
                />
            </div>
        </Button>
    );
};

export default ButtonStory;
