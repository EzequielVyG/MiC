import React, { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { TextField, IconButton, InputAdornment } from '@mui/material';

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

const MyInput: React.FC<InputProps> = ({ field, ...props }) => {
	const [showPassword, setShowPassword] = useState(false);

	const handleTogglePassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<TextField
			{...field}
			{...props}
			type={showPassword ? 'text' : 'password'}
			fullWidth
			margin='normal'
			InputProps={{
				endAdornment: (
					<InputAdornment position='end'>
						<IconButton onClick={handleTogglePassword} edge='end'>
							{showPassword ? <VisibilityOff /> : <Visibility />}
						</IconButton>
					</InputAdornment>
				),
			}}
			required
		/>
	);
};

export default MyInput;
