import React, { useState, useEffect, useRef } from 'react';
import IMask from 'imask';
import { TextField } from '@mui/material';

interface CuilInputProps {
	field: {
		name?: string;
		value?: any;
		onChange?: (event: React.ChangeEvent<any>) => void;
		onBlur?: (event: React.FocusEvent<any>) => void;
		label: string;
		disabled?: boolean;
		size?: 'medium' | 'small';
		type?: 'number';
		required?: boolean;
	};
	id?: string;
	form?: any;
	shrink?: boolean;
	inputValue?: string;
	onInputChange?: (newValue: string | undefined) => void;
	// Add more custom props specific to CuilInput if needed
}

const CuilInput: React.FC<CuilInputProps> = ({
	field,
	shrink,
	id,
	inputValue,
	onInputChange,
	...props
}) => {
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);

	useEffect(() => {
		const inputElement = inputRef.current;
		if (inputElement) {
			const cuilMask = IMask(inputElement, {
				mask: '00-00000000-0',
				lazy: true,
				overwrite: true,
				blocks: {
					'00': {
						mask: /^[0-9]{1,2}$/,
					},
					'00000000': {
						mask: /^[0-9]{1,8}$/,
					},
					'0': {
						mask: /^[0-9]{1}$/,
						optional: false,
					},
				},
			});
			cuilMask.on('accept', () => setFocused(true));
			cuilMask.on('complete', () => setFocused(false));
			cuilMask.on('input', () => {});

			inputElement.addEventListener('input', () => {
				const newValue = cuilMask.value;
				if (onInputChange) onInputChange(newValue);
			});
		}
	}, []);

	return (
		<TextField
			id={id}
			fullWidth
			type='text'
			{...field}
			{...props}
			inputRef={inputRef}
			InputLabelProps={{ shrink: shrink && focused }}
			value={inputValue}
		/>
	);
};

export default CuilInput;
