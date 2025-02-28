import React from "react";
import Label from "../Label/Label";
import isColorCloseToWhite from "./isColorCloseToWhite";

interface TagCategoryProps {
  text: string;
  color?: string;
  onClickCategory?: () => void;
}

const TagCategory: React.FC<TagCategoryProps> = ({
  text,
  color,
  onClickCategory,
}) => {
  let changeFontColor;
  if (color) changeFontColor = isColorCloseToWhite(color);
  return (
    <div
      style={{
        backgroundColor: color ? color : "#8EA2A5",
        color: changeFontColor ? "#434343" : "white",
        borderRadius: "20px",
        padding: "2px 5px 0px 5px",
        marginLeft: "5px",
        display: "inline-block",
        whiteSpace: "nowrap",
        margin: 1
      }}
      onClick={onClickCategory}
    >
      <Label text={text} variant="subtitle2" />
    </div>
  );
};

export default TagCategory;
