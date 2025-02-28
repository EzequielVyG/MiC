import React from "react";
import { Alert } from "@mui/material";

type AlertProps = {
    label: string;
    severity: "error" | "info" | "success" | "warning";
    onClose?: () => void;
};

const MyAlert: React.FC<AlertProps> = ({ label, severity, onClose }) => {
    return (
        <Alert
            severity={severity}
            onClose={onClose}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 10,
            }}>
            {label}
        </Alert>
    );
};

export default MyAlert;
