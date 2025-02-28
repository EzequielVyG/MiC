import languages from "@/locale/codigoArea";
import en from "@/locale/en";
import es from "@/locale/es";
import {
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface CmiInputProps {
  value?: string;
  onChange?: (event: SelectChangeEvent<any>) => void;
  onBlur?: (event: React.FocusEvent<any>) => void;
}

const CmiInput: React.FC<CmiInputProps> = ({ value, onChange, onBlur }) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const router = useRouter();
  const { locale } = router;
  const t: any = locale === "en" ? en : es;

  useEffect(() => {
    if (value) {
      setSelectedCountry(value);
    }
  }, []);

  const handleCountryChange = (event: SelectChangeEvent<any>) => {
    setSelectedCountry(event.target.value);
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Grid>
      <InputLabel id="country-label">{t["country"]}</InputLabel>
      <Select
        value={selectedCountry}
        onChange={handleCountryChange}
        onBlur={onBlur}
      >
        {languages.map((language) => (
          <MenuItem key={language.abbreviation} value={language.phoneCode} translate="no">
            {language.flag} {language.abbreviation}
          </MenuItem>
        ))}
      </Select>
    </Grid>
  );
};

export default CmiInput;
