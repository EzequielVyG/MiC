import {
    Card,
    CardActionArea,
    CardContent,
    Typography,
    Box,
    useTheme,
} from "@mui/material";
import React, { useState } from "react";

type CardProps = {
    title: string;
    description: string;
    date: string;
    status?: string;
    onClick?: () => void;
};

const CardRequest: React.FC<CardProps> = ({
    title,
    description,
    date,
    status,
    onClick,
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const theme = useTheme();

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
                backgroundColor: status === "Recibido" ? theme.palette.secondary.main : "white",
            }}
        >
            <CardActionArea>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between", // Alinea los elementos en la misma fila
                        alignItems: "center",
                        padding: "8px 16px",
                    }}
                >
                    <div>
                        <Typography variant="h6" component="div" fontWeight="bold">
                            {title}
                        </Typography>
                    </div>
                    <div>
                        <Typography variant="caption" color="text.secondary">
                            {date}
                        </Typography>
                    </div>
                </Box>
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default CardRequest;
