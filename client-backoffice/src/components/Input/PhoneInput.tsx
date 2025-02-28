import languages from "@/locale/codigoArea";
import { Grid, InputAdornment, InputLabel, TextField } from "@mui/material";
import IMask from "imask";
import React, { useEffect, useRef, useState } from "react";

interface PhoneInputProps {
  value?: any;
  cmiValue?: any;
  onChange?: (event: React.ChangeEvent<any>) => void;
  onBlur?: (event: React.FocusEvent<any>) => void;
  shrink?: boolean;
  required?: boolean;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  cmiValue,
  onChange,
  onBlur,
  shrink,
  required
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedCountryData, setSelectedCountryData] = useState(
    languages.find((language) => language.phoneCode === "+54")
  );

  useEffect(() => {
    if (cmiValue) {
      // Actualiza el código de área según la prop cmiValue
      setSelectedCountryData(
        languages.find((language) => language.phoneCode === cmiValue)
      );
    }

    const inputElement = inputRef.current;
    if (inputElement) {
      const phoneMask = IMask(inputElement, {
        mask: `0 (000) 000-0000`, // Usar el código de país en la máscara
        lazy: true,
        overwrite: false,
        blocks: {
          "0": {
            mask: /^[0-9]{1,1}$/,
          },
          "00": {
            mask: /^[0-9]{1,2}$/,
          },
          "000": {
            mask: /^[0-9]{1,3}$/,
          },
          "0000": {
            mask: /^[0-9]{1,4}$/,
          },
        },
      });

      phoneMask.on("accept", () => setFocused(true));
      phoneMask.on("complete", () => setFocused(false));
    }
  }, [cmiValue]);

  return (
    <Grid item xs={8}>
      <InputLabel id="country-label">{required ? "*Teléfono" : "Teléfono"}</InputLabel>
      <TextField
        fullWidth
        type="text"
        inputRef={inputRef}
        InputLabelProps={{ shrink: shrink && focused }}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              {`${selectedCountryData?.phoneCode}`}
            </InputAdornment>
          ),
        }}
      />
    </Grid>
  );
};

export default PhoneInput;
