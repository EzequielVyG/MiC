import { UserAccount } from '@/features/Users/userAccount';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import React from 'react';
import MyAvatar from '../Avatar/Avatar';

interface App {
	provider: string;
	title: string;
	image: string; // Cambiar el tipo de 'image' a 'string' para que sea el nombre del archivo
}

interface CardLinkAccountProps {
	userAccount: UserAccount | undefined;
	app: App;
	onClick: () => void;
	linkText: string;
	linkedText: string;
	sx?: object;
}

const CardLinkAccount: React.FC<CardLinkAccountProps> = ({
	userAccount,
	app,
	onClick,
	linkText,
	linkedText,
	sx,
}) => {
	const isButtonDisabled = userAccount && userAccount.provider === app.provider;

	const cardStyle = {
		width: '170px', // Cambia este valor al que necesites
		height: '240px', // Cambia este valor al que necesites
		overflow: 'hidden',
	};

	// eslint-disable-next-line @typescript-eslint/no-var-requires
	const appImage = require(`./${app.image}`).default.src;

	return (
		<Card sx={{ ...sx, ...cardStyle }}>
			<CardMedia
				component='img'
				alt={app.title}
				height='100'
				image={appImage}
				sx={{ objectFit: 'contain', display: 'flex', justifyContent: 'center' }}
			/>
			<CardContent>
				<Typography variant='h5' sx={{ marginBottom: '15px' }}>
					{app.title}
				</Typography>
				<Button
					onClick={onClick}
					variant='contained'
					color='primary'
					size='small'
					disabled={isButtonDisabled}
				>
					{isButtonDisabled ? linkedText : linkText}
				</Button>

				{isButtonDisabled && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							alignItems: 'center',
						}}
					>
						<MyAvatar src={userAccount?.image} sx={{ scale: '0.5' }} />
						<Typography
							variant='caption'
							sx={{
								color: 'grey',
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
							}}
						>
							{userAccount?.name ? userAccount?.name : userAccount?.email}
						</Typography>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default CardLinkAccount;
