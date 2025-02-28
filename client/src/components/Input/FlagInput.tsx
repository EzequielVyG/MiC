import { TextField } from '@mui/material';
import React from 'react';

interface TextInputProps {
  field: {
    name?: string;
    value?: any;
    onChange?: (event: React.ChangeEvent<any>) => void;
    onBlur?: (event: React.FocusEvent<any>) => void;
    label: string | JSX.Element;
    disabled?: boolean;
    size?: 'medium' | 'small';
    type?: 'email' | 'text' | 'number' | 'date' | 'datetime-local';
    required?: boolean;
    multiline?: boolean;
    rows?: number;
  };
  id?: string;
  form?: any;
  shrink?: boolean;
}

const FlagInput: React.FC<TextInputProps> = ({ field, shrink, id, ...props }) => {
  return (
    <TextField
      id={id}
      fullWidth
      type='text'
      {...field}
      {...props}
      InputLabelProps={{ shrink: shrink }}
    />
  );
};

export default FlagInput;
