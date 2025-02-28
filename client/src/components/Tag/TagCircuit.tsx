import React from "react";
import { SxProps, Typography } from "@mui/material";
import isColorCloseToWhite from "./isColorCloseToWhite";

interface TagProps {
  text: string;
  color?: string;
  sx: SxProps;
}

const TagCircuit: React.FC<TagProps> = ({ text, color }) => {
  let changeFontColor;
  if (color) changeFontColor = isColorCloseToWhite(color);
  return (
    <div
      style={{
        backgroundColor: color ? color : "#E6BE17",
        color: changeFontColor ? "#434343" : "white",
        borderRadius: 20,
        padding: "5px 10px",
        display: "flex",
        marginLeft: "5px",
        whiteSpace: "nowrap",
        width: "75vw",
        maxWidth: "600px",
        maxHeight: "35px",
        height: "9vw",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        {text.length > 30 ? `${text.substring(0, 30)}...` : text}
      </Typography>
    </div>
  );
};

export default TagCircuit;
