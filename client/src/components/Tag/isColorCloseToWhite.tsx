function isColorCloseToWhite(color: string) {
  // Convertimos el color hexadecimal a RGB
  const hexToRgb = (hex: string) => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
  };

  const white = hexToRgb("#FFFFFF");
  const backgroundColor = hexToRgb(color);

  // Calculamos la diferencia absoluta en cada componente RGB
  const rDiff = Math.abs(white.r - backgroundColor.r);
  const gDiff = Math.abs(white.g - backgroundColor.g);
  const bDiff = Math.abs(white.b - backgroundColor.b);

  // Calculamos la suma total de las diferencias
  const totalDiff = rDiff + gDiff + bDiff;

  // Si la suma total es menor que un umbral, el color se considera cercano al blanco
  const threshold = 200; // Puedes ajustar este umbral según tus necesidades
  return totalDiff < threshold;
}

export default isColorCloseToWhite;
