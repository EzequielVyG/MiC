import React from "react";
import { Button } from "@mui/material";

type SignInButtonProps = {
    provider: "google" | "facebook"; // Puedes agregar más proveedores si es necesario
    onClick: () => void;
    icon: React.ReactNode; // Prop para pasar el icono
};

const SignInButton: React.FC<SignInButtonProps> = ({ provider, onClick, icon }) => {
    const buttonText = "Iniciar sesión con " + `${provider.charAt(0).toUpperCase() + provider.slice(1)}`;

    return (
        <Button
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                border: "none",
                borderRadius: "50px",
                backgroundColor: "#fff",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
            }}
            onClick={onClick}
        >
            {icon} {/* Renderiza el icono pasado como prop */}
            {buttonText}
        </Button>
    );
};

export default SignInButton;
