import Avatar from '@mui/material/Avatar';
import { SxProps } from '@mui/system';

type AvatarProps = {
	src?: string;
	className?: string;
	alt?: string;
	sx?: SxProps;
};

const MyAvatar: React.FC<AvatarProps> = ({ src, alt, className, sx }) => {
	return (
		<Avatar alt={alt} src={src} className={className} sx={sx}>
			{src ? null : alt ? alt.charAt(0).toUpperCase() : null}
		</Avatar>
	);
};

export default MyAvatar;
