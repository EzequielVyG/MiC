import React from "react";
import { Typography } from "@mui/material";

type TitleProps = {
  text: string;
};

const SubTitle: React.FC<TitleProps> = ({ text }) => {
  return (
    <Typography variant="h6" style={{ textAlign: "center" }}>
      {text}
    </Typography>
  );
};

export default SubTitle;
