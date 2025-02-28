import React, { useRef, useEffect } from 'react';
import IMask from 'imask';
import { TextField } from '@mui/material';

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
		multiline?: boolean;
	};
	id?: string;
	form?: any;
	shrink?: boolean;
	mask?: string; // Nueva prop para la máscara opcional
	// Agrega más propiedades personalizadas según sea necesario
}

const MyInput: React.FC<TextInputProps> = ({
	field,
	shrink,
	mask, // Nueva prop para la máscara opcional
	...props
}) => {
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const inputElement = inputRef.current;
		if (inputElement && mask) {
			// Aplicar la máscara si se proporciona
			IMask(inputElement, {
				mask,
				lazy: true,
			});
		}
	}, [mask]);

	return (
		<TextField
			fullWidth
			type='text'
			{...field}
			{...props}
			inputRef={inputRef}
			InputLabelProps={{ shrink: shrink }}
		/>
	);
};

export default MyInput;
