import React from 'react';
import { TextField } from '@mui/material';
import IMask from 'imask';

interface PhoneInputProps {
  field: {
    name?: string;
    value?: any;
    onChange?: (event: React.ChangeEvent<any>) => void;
    onBlur?: (event: React.FocusEvent<any>) => void;
    label: string;
    disabled?: boolean;
    size?: 'medium' | 'small';
    type?: 'email' | 'text' | 'number' | 'date';
    required?: boolean;
    mask?: string; // Agregar una prop "mask" opcional para la máscara
  };
  form?: any;
  shrink?: boolean;
  // Add more custom props specific to TextInput if needed
}

const PhoneInput: React.FC<PhoneInputProps> = ({ field, shrink, ...props }) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Aplicamos la máscara IMask si se proporciona la prop "mask"
  React.useEffect(() => {
    const inputElement = inputRef.current;
    if (inputElement && field.mask) {
      IMask(inputElement, {
        mask: field.mask,
        lazy: true,
        overwrite: false,
        blocks: {
          '00': {
            mask: /^[0-9]{1,2}$/,
          },
          '0': {
            mask: /^[0-9]{1,1}$/,
          },
          '(000)': {
            mask: /^[0-9]{1,3}$/,
          },
          '000': {
            mask: /^[0-9]{1,3}$/,
          },
          '0000': {
            mask: /^[0-9]{1,4}$/,
          },
        },
      });
    }
  }, [field.mask]);

  return (
    <TextField
      fullWidth
      type="text"
      {...field}
      {...props}
      inputRef={inputRef}
      InputLabelProps={{ shrink: shrink }}
    />
  );
};

export default PhoneInput;