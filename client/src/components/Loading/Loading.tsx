import React, { useState, useEffect } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingSpinner: React.FC = () => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const colors = ["#E6BE17", "#3FA7CD", "#984D98"];

  useEffect(() => {
    const changeColorInterval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % colors.length);
    }, 1280); // Cambiar el color cada 1000 ms (1 segundo)

    return () => {
      clearInterval(changeColorInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentColor = colors[currentColorIndex];

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <CircularProgress
        style={{
          color: currentColor,
          transition: "color 0.4s ease-in-out", // Transición suave de color
        }}
        size={80}
      />
    </div>
  );
};

export default LoadingSpinner;
