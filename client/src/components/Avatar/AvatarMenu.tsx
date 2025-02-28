import { Route } from '@/components/Routes';
import { logout } from '@/features/Users/hooks/usePostLogoutQuery';
import en from '@/locale/en';
import es from '@/locale/es';
import useFcmToken from '@/utils/hooks/useFcmToken';
import { Menu, MenuItem } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import Label from '../Label/Label';
import AvatarButton from './AvatarButton';
import { setCookie } from 'nookies';

type AvatarMenuProps = {
	userData: {
		avatar?: string;
		name?: string;
	};
	routes: Route[];
};

const AvatarMenu: React.FC<AvatarMenuProps> = ({ userData, routes }) => {
	const { data: session } = useSession();
	const { fcmToken } = useFcmToken();

	const router = useRouter();
	const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
	const avatarRef = useRef<HTMLButtonElement | null>(null);
	const { locale } = router;
	const t: any = locale === 'en' ? en : es; // Asegúrate de que 'en' y 'es' estén definidos correctamente

	const handleAvatarClick = () => {
		setMenuAvatarOpen(true);
	};

	const handleMenuAvatarClose = () => {
		setMenuAvatarOpen(false);
	};

	const handleLogoutClick = async () => {
		signOut({ callbackUrl: '/api/auth/signin' });
		logout(session?.user?.email as string, fcmToken);
		setCookie(null, 'accountId', '', { path: '/', expires: new Date() });
		setCookie(null, 'provider', '', { path: '/', expires: new Date() });
		setCookie(null, 'type', '', { path: '/', expires: new Date() });
		setCookie(null, 'email', '', {
			path: '/',
			expires: new Date(),
		});
	};

	return (
		<div style={{ display: 'flex', justifyContent: 'center' }}>
			<AvatarButton
				ref={avatarRef}
				src={userData?.avatar}
				alt={userData?.name}
				onClick={handleAvatarClick}
			/>
			<Menu
				anchorEl={avatarRef.current}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'center',
				}}
				open={menuAvatarOpen}
				onClose={handleMenuAvatarClose}
			>
				{/* Items del menu */}
				{routes?.map((page: Route, index: number) => (
					<MenuItem key={index} onClick={() => router.push(page.path)}>
						{t[page.name]}
					</MenuItem>
				))}
				<MenuItem onClick={handleLogoutClick}>
					<Label text={t['signOff']}></Label>
				</MenuItem>

				{/* Agregar más elementos de menú */}
			</Menu>
		</div>
	);
};

export default AvatarMenu;
