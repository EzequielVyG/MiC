import React from "react";
import { Typography } from "@mui/material";

type TitleProps = {
    textTitle: string;
};

const Title: React.FC<TitleProps> = ({ textTitle }) => {
    return (
        <Typography variant="h1" style={{ textAlign: 'center' }}>
            {textTitle}
        </Typography >
    );
};

export default Title;
