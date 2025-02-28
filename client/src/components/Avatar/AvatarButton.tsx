import React, { forwardRef } from 'react';
import { Button, SxProps } from '@mui/material';
import Avatar from './Avatar';

type AvatarButtonProps = {
	src?: string;
	alt?: string;
	onClick?: () => void;
	sx?: SxProps;
};

const AvatarButton: React.ForwardRefRenderFunction<
	HTMLButtonElement,
	AvatarButtonProps
> = ({ src, alt, onClick, sx }, ref) => {
	const avatarStyle: SxProps = {
		'&:hover': {
			filter: 'brightness(1.2)', // Cambio de brillo al hacer hover
		},
	};

	return (
		<Button onClick={onClick} sx={sx} style={{ padding: 0 }} ref={ref}>
			<Avatar alt={alt} src={src} sx={avatarStyle} />
		</Button>
	);
};

export default forwardRef(AvatarButton);
