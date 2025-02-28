import { Menu, MenuItem } from '@mui/material';
import AvatarButton from './AvatarButton';
import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'next-auth/react';
import { Route } from '@/components/Routes';
// import Cookies from "js-cookie";

type AvatarMenuProps = {
	userData: {
		avatar?: string;
		name?: string;
	};
	routes: Route[];
};

const AvatarMenu: React.FC<AvatarMenuProps> = ({ userData, routes }) => {
	const router = useRouter();
	const [menuAvatarOpen, setMenuAvatarOpen] = useState(false);
	const avatarRef = useRef<HTMLButtonElement | null>(null);

	const handleAvatarClick = () => {
		setMenuAvatarOpen(true);
	};

	const handleMenuAvatarClose = () => {
		setMenuAvatarOpen(false);
	};

	const handleLogoutClick = async () => {
		// Cookies.remove("next-auth");
		signOut({ callbackUrl: '/api/auth/signin' });
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
						{page.name}
					</MenuItem>
				))}
				<MenuItem onClick={handleLogoutClick}>Cerrar sesión</MenuItem>

				{/* Agregar más elementos de menú */}
			</Menu>
		</div>
	);
};

export default AvatarMenu;
