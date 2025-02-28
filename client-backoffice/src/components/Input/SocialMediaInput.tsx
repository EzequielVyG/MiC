import React from 'react';
import { FiAtSign } from "react-icons/fi";
import { TextField, InputAdornment } from '@mui/material';

interface InputProps {
    field: {
        value: any;
        onChange: (event: React.ChangeEvent<any>) => void;
        onBlur: (event: React.FocusEvent<any>) => void;
        label: string;
        disabled?: boolean;
        size?: 'medium' | 'small';
    };
    form: any;
    // Add more custom props specific to EmailInput if needed
}

const SocialMediaInput: React.FC<InputProps> = ({ field, ...props }) => {

    return (
        <TextField
            {...field}
            {...props}
            type={'text'}
            fullWidth
            margin='normal'
            InputProps={{
                startAdornment: (
                    <InputAdornment position='start'>
                        <FiAtSign />
                    </InputAdornment>
                ),
            }}
        // required
        />
    );
};

export default SocialMediaInput;
