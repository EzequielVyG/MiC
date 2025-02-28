import { createTheme } from "@mui/material/styles";
import "@fontsource/rubik"; // Defaults to weight 400

const colorSchema = {
  // Colores principales (no usar)
  primary: {
    light: "#E6BE17", //yellow
    main: "#3FA7CD", //blue
    dark: "#984D98", //violet
  },
  // Colores secundarios
  secondary: {
    light: "#F4E398",
    main: "#9DD4E0",
    dark: "#C7ABC9",
  },
  info: {
    light: "#1976D2", // Color estándar de Material Design para info
    main: "#3FA7CD", // Color estándar de Material Design para info
    dark: "#0D47A1", // Color estándar de Material Design para info
  },
  success: {
    light: "#4CAF50", // Color estándar de Material Design para success
    main: "#8BC34A", // Color estándar de Material Design para success
    dark: "#388E3C", // Color estándar de Material Design para success
  },
  warning: {
    light: "#FFC107", // Color estándar de Material Design para warning
    main: "#FF9800", // Color estándar de Material Design para warning
    dark: "#F57C00", // Color estándar de Material Design para warning
  },
  error: {
    light: "#F44336", // Color estándar de Material Design para error
    main: "#FF5722", // Color estándar de Material Design para error
    dark: "#D32F2F", // Color estándar de Material Design para error
  },
};

const colorTheme = createTheme({
  palette: colorSchema,
});

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  palette: colorSchema,
  typography: {
    fontFamily: ["Rubik", "sans-serif"].join(","),
    // h4: {
    //   fontSize: 32,
    //   fontWeight: 500,
    // },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: colorTheme.palette.primary.main,
        },
      },
      variants: [
        {
          props: { variant: "outlined" }, //Componente de Boton Sumbit Form
          style: {
            color: "black",
            backgroundColor: colorTheme.palette.secondary.dark,
            "&:hover": {
              borderColor: colorTheme.palette.secondary.dark,
              backgroundColor: colorTheme.palette.secondary.light,
            },
            "&:active": {
              borderColor: colorTheme.palette.secondary.light,
              backgroundColor: colorTheme.palette.secondary.light,
            },
            borderRadius: 5,
          },
        },
        {
          props: { variant: "contained" }, //Boton de login
          style: {
            color: "Black",
            backgroundColor: colorTheme.palette.secondary.main,
            borderRadius: 5,
            "&:hover": {
              backgroundColor: colorTheme.palette.secondary.light,
            },
            "&:active": {
              backgroundColor: colorTheme.palette.secondary.light,
            },
          },
        },
      ],
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "h1" }, //Componente de Texto Formulario
          style: {
            fontSize: 32,
            fontWeight: "bold",
            color: colorTheme.palette.secondary.dark
          },
        },
        {
          props: { variant: "h4" }, //Componente de Texto Formulario
          style: {
            fontSize: 32,
            fontWeight: "bold",
          },
        },
      ],
    },
    MuiFormLabel: {
      variants: [
        {
          props: { id: "questionTitle" }, //Componente de Texto Pregunta
          style: {
            fontWeight: "bold",
            fontSize: 18,
            color: "black",
            backgroundColor: colorTheme.palette.success.dark,
            padding: "2%",
            borderRadius: 10,
          },
        },
      ],
    },
    MuiFormControlLabel: {
      //Componente de Texto Radio Buttons
      styleOverrides: {
        label: {
          fontWeight: "normal",
          fontSize: 16,
          color: "black",
        },
      },
    },
    MuiRadio: {
      //Componente Radio Button
      styleOverrides: {
        root: {
          color: "black",
        },
      },
    },
    MuiCheckbox: {
      //Componente Checkbox Button
      styleOverrides: {
        root: {
          color: "black",
          transform: "scale(1)",
          "&.Mui-checked": {
            color: "secondary",
          },
        },
      },
    },
    MuiSlider: {
      //Componente Checkbox Button
      styleOverrides: {
        root: {
          color: "secondary",
          transform: "scale(0.9)",
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: colorTheme.palette.info.main,
        },
      },
    },
    MuiToolbar: {
      styleOverrides: {
        root: {
          backgroundColor: colorTheme.palette.secondary.main,
        },
      },
    },
  },
});

export default theme;
