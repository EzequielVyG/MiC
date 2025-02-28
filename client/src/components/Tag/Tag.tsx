import React from "react";
import Label from "../Label/Label";
import isColorCloseToWhite from "./isColorCloseToWhite";

interface TagProps {
  text: string;
  color?: string;
  width?: string;
}

const Tag: React.FC<TagProps> = ({ text, color, width }) => {
  let changeFontColor;
  if (color) changeFontColor = isColorCloseToWhite(color);
  return (
    <div
      style={{
        backgroundColor: color ? color : "#B88268",
        color: changeFontColor ? "#434343" : "white",
        borderRadius: "5px",
        padding: "5px 10px",
        display: "inline-block",
        whiteSpace: "nowrap",
        width: width ? width : "",
      }}
    >
      <Label text={text} variant="subtitle2" />
    </div>
  );
};

export default Tag;
