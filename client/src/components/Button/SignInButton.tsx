import en from '@/locale/en';
import es from '@/locale/es';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import React from 'react';

type SignInButtonProps = {
	provider: 'google' | 'facebook' | 'twitter' | 'twitch' | 'tiktok'; // Puedes agregar más proveedores si es necesario
	onClick: () => void;
	icon: React.ReactNode; // Prop para pasar el icono
};

const SignInButton: React.FC<SignInButtonProps> = ({
	provider,
	onClick,
	icon,
}) => {
	const router = useRouter();
	const { locale } = router;
	const t = locale === 'en' ? en : es;

	const buttonText =
		t.buttonsignin + `${provider.charAt(0).toUpperCase() + provider.slice(1)}`;

	return (
		<Button
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				padding: '12px 16px',
				border: 'none',
				borderRadius: '50px',
				backgroundColor: '#fff',
				fontSize: '16px',
				cursor: 'pointer',
				boxShadow: '0 1px 2px rgba(0, 0, 0, 0.5)',
			}}
			onClick={onClick}
		>
			{icon} {/* Renderiza el icono pasado como prop */}
			{buttonText}
		</Button>
	);
};

export default SignInButton;
