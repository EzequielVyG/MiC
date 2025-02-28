import { FormControlLabel, Switch, TextField } from '@mui/material';
import IMask from 'imask';
import React, { useEffect, useRef, useState } from 'react';

interface PhoneInputProps {
	field: {
		name?: string;
		value?: any;
		onChange?: (event: React.ChangeEvent<any> | string) => void;
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
	isFree?: boolean;
	inputValue?: string;
	onInputChange?: (newValue: string | undefined) => void;
	// Add more custom props specific to CuilInput if needed
}

const PriceInput: React.FC<PhoneInputProps> = ({
	field,
	shrink,
	id,
	isFree,
	inputValue,
	onInputChange,
	...props
}) => {
	const [focused, setFocused] = useState(false);
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [prevInputValue, setPrevInputValue] = useState<string | undefined>(
		inputValue
	);

	const handleSwitchChange = () => {
		if (inputValue === 'Gratuito') {
			if (prevInputValue === 'Gratuito') {
				onInputChange!('');
			} else {
				onInputChange!(prevInputValue);
			}
		} else {
			setPrevInputValue(inputValue);
			onInputChange!('Gratuito');
		}
	};

	useEffect(() => {
		const inputElement = inputRef.current;
		if (inputElement) {
			const cuilMask = IMask(inputElement, {
				mask: '$aaaaaaa,bb',
				lazy: true,
				overwrite: false,
				blocks: {
					aaaaaaa: {
						mask: /^[0-9]{0,7}$/,
					},
					bb: {
						mask: /^[0-9]{0,2}$/,
					},
				},
			});

			cuilMask.on('accept', () => setFocused(true));
			cuilMask.on('complete', () => setFocused(false));
		}
	}, []);

	return (
		<div style={{ display: 'flex', alignItems: 'center' }}>
			<TextField
				id={id}
				fullWidth
				type='text'
				{...field}
				{...props}
				inputRef={inputRef}
				InputLabelProps={{ shrink: shrink && focused }}
				disabled={inputValue === 'Gratuito'} // Habilita o deshabilita el TextField
				value={inputValue}
				onChange={(event) => {
					const newValue = event.target.value;
					onInputChange!(newValue);
				}}
			/>
			{isFree && (
				<FormControlLabel
					style={{ marginLeft: '5px' }}
					control={
						<Switch
							color='success'
							checked={inputValue === 'Gratuito'} // Establece el estado del Switch en función del valor
							onChange={handleSwitchChange}
						/>
					}
					label='Gratuito'
				/>
			)}
		</div>
	);
};

export default PriceInput;
