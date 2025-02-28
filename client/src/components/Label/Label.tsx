import React from 'react';
import { Typography } from '@mui/material';

type LabelProps = {
	id?: string;
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
	style?: React.CSSProperties
};

const Label: React.FC<LabelProps> = ({
	id,
	text,
	color = '',
	variant = 'body1',
	style = {}
}) => {
	return (
		<Typography id={id} style={style} color={color} variant={variant}>
			{text}
		</Typography>
	);
};

export default Label;
