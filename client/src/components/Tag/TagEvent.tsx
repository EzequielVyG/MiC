import React from "react";
import Label from "../Label/Label";

interface TagEventProps {
  text: string;
}

const TagEvent: React.FC<TagEventProps> = ({
  text,
}) => {
  return (
    <div
      style={{
        backgroundColor: "white",
        color: "#434343", // Color de texto gris
        border: "1px solid #434343", // Contorno gris
        borderRadius: "20px",
        padding: "0px 10px", // Ajusta el relleno según tus preferencias
        marginLeft: "5px",
        display: "inline-block",
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      <Label text={text} variant="subtitle2" />
    </div>
  );
};

export default TagEvent;
