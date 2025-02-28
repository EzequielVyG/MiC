import { TextField } from '@mui/material';
import React from 'react';

interface TextInputProps {
	field: {
		name?: string;
		value?: any;
		onChange?: (event: React.ChangeEvent<any>) => void;
		onBlur?: (event: React.FocusEvent<any>) => void;
		label: string;
		disabled?: boolean;
		size?: 'medium' | 'small';
		type?: 'email' | 'text' | 'number';
		required?: boolean;
		multiline?: boolean
		rows?: number
	};
	id?: string;
	form?: any;
	shrink?: boolean;
	// Add more custom props specific to TextInput if needed
}

const MyInput: React.FC<TextInputProps> = ({ field, shrink, id, ...props }) => {
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

export default MyInput;
