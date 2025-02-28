import React from 'react';
import { Typography, Box } from '@mui/material';

type LabelProps = {
	text: string;
	color?:
		| 'initial'
		| 'inherit'
		| 'primary'
		| 'secondary'
		| 'textPrimary'
		| 'textSecondary'
		| 'error';
	variant?:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'subtitle1'
		| 'subtitle2'
		| 'body1'
		| 'body2'
		| 'caption'
		| 'button'
		| 'overline';
	sx?: React.CSSProperties; // Agregamos la prop opcional sx
};

const Label: React.FC<LabelProps> = ({
	text,
	color = '',
	variant = 'body1',
	sx = {}, // Propiedad sx opcional para estilos extras
}) => {
	return (
		<Box sx={sx}>
			<Typography color={color} variant={variant}>
				{text}
			</Typography>
		</Box>
	);
};

export default Label;
