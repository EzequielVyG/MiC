import React from "react";
import { Link, Typography } from "@mui/material";

type SignUpLinkProps = {
    onClick: () => void;
};

const SignUpLink: React.FC<SignUpLinkProps> = ({ onClick }) => {
    return (
        <Typography variant="body2">
            ¿No tienes una cuenta?{" "}
            <Link component="button" color="primary" onClick={onClick}>
                Regístrate
            </Link>
        </Typography>
    );
};

export default SignUpLink;
