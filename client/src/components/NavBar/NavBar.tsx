import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
import en from '@/locale/en';
import es from '@/locale/es';
import MenuIcon from '@mui/icons-material/Menu';
import {
	AppBar,
	Box,
	Drawer,
	Link,
	List,
	ListItem,
	ListItemText,
	Toolbar,
	useTheme,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import LanguageDropdown from '../Language/LanguageDropdown';
import Logo from '../Logo/Logo'; // Ajusta la ruta a tu componente Logo
import LogoColor from '../Logo/LogoTypes';

import NotificationIcon from '../NotificationIcon/NotificationIcon';

import Routes, {
	LoggedRequire,
	Route,
	RoutesVisibility,
} from '@/components/Routes';
import AvatarMenu from '../Avatar/AvatarMenu';
import NavBarButton from '../Button/NavBarButton';

const initialPerfilRoutes: Route[] = [
	{
		path: '/home',
		name: 'Home',
		permission: [],
		requireLogin: LoggedRequire.NO,
		visible: RoutesVisibility.NO,
	},
];

const Navbar: React.FC = () => {
	const { data: session } = useSession();
	const theme = useTheme(); // Obtiene el objeto theme
	const router = useRouter();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es; // Asegúrate de que 'en' y 'es' estén definidos correctamente

	const [userData, setUserData] = useState<User | null>(null);
	const [allowedNavBarRoutes, setAllowedNavBarRoutes] =
		useState<any[]>(initialPerfilRoutes);
	const [allowedPerfilRoutes, setAllowedPerfilRoutes] =
		useState<any[]>(initialPerfilRoutes);

	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		getUserInfo(session?.user?.email);
		getUserAllowedRoutes();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const getUserInfo = async (email: string | null | undefined) => {
		if (email) {
			const response = await getuserByEmail(email);
			if (response.data) {
				setUserData(response.data);
			}
		}
	};

	const getUserAllowedRoutes = () => {
		const filteredNavBarRoutes = Routes.filter((route: any) => {
			if (route.visible !== RoutesVisibility.NAVBAR) {
				return false;
			}
			if (route.requireLogin === LoggedRequire.DONT_CARE) {
				return true;
			}
			if (session?.user) {
				return route.requireLogin === LoggedRequire.YES;
			}
			return route.requireLogin === LoggedRequire.NO;
		});

		const filteredPerfilRoutes = Routes.filter((route: any) => {
			if (route.visible !== RoutesVisibility.PERFIL) {
				return false;
			}
			if (route.requireLogin === LoggedRequire.DONT_CARE) {
				return true;
			}
			if (session?.user) {
				return route.requireLogin === LoggedRequire.YES;
			}
			return route.requireLogin === LoggedRequire.NO;
		});

		setAllowedNavBarRoutes(filteredNavBarRoutes);
		setAllowedPerfilRoutes(filteredPerfilRoutes);
	};

	const handleToggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	return (
		<Box>
			<AppBar position='static'>
				<Toolbar
					style={{
						display: 'flex',
						flexDirection: 'row',
						borderBottom: `10px solid ${theme.palette.primary.dark}`,
						backgroundColor: 'white',
					}}
					sx={{
						justifyContent: { md: 'space-between', xs: 'space-between' },
					}}
				>
					{/* Box de Menu de celular */}
					<Box
						sx={{
							display: {
								xs: 'block',
								md: 'block',
								lg: 'none',
								xl: 'none',
							}, // Se muestra en xs y s
						}}
					>
						<NavBarButton onClick={handleToggleMenu}>
							<MenuIcon sx={{ color: '#AEAEAE' }} />
						</NavBarButton>
					</Box>

					{/* Logo a la izquierda */}
					<Link
						onClick={() => router.push('/home')}
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<Logo color={LogoColor.DIGITAL_PHRASE} width={160} />
					</Link>

					<Box
						sx={{
							display: {
								xs: 'none',
								md: 'none',
								lg: 'flex',
								xl: 'flex',
								gap: '10px',
								alignItems: 'center',

								overflow: 'hidden',
								// marginRight: '8%',
							},
						}}
					>
						{/* Botones de navegación centrados */}
						{allowedNavBarRoutes?.map((page: Route, index: number) => (
							<NavBarButton key={index} onClick={() => router.push(page.path)}>
								<div style={{ display: 'flex', alignItems: 'center' }}>
									<span style={{ marginRight: '8px' }}>{page.icon}</span>
									{t[page.name]}
								</div>
							</NavBarButton>
						))}

						{/* Menú desplegable de idioma y otros elementos a la derecha */}
					</Box>

					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							overflow: 'hidden',
						}}
					>
						<Box
							sx={{
								display: {
									xs: 'none',
									md: 'none',
									lg: 'flex',
									xl: 'flex',
									gap: '10px',
									alignItems: 'center',
									// marginRight: '8%',
								},
							}}
						>
							<LanguageDropdown />
						</Box>
						{/* Icono de notificaciones a la derecha */}
						{session?.user && new Date(session.expires) > new Date() && (
							<Box sx={{ display: 'flex', alignItems: 'center' }}>
								<ListItem button onClick={() => router.push('/notifications')}>
									<NotificationIcon />
								</ListItem>
							</Box>
						)}
						{userData && session && new Date(session.expires) > new Date() && (
							<AvatarMenu
								userData={userData!}
								routes={allowedPerfilRoutes}
							></AvatarMenu>
						)}
					</div>
				</Toolbar>
			</AppBar>

			<Drawer anchor='left' open={menuOpen} onClose={handleToggleMenu}>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					<div
						style={{
							display: 'flex',
							justifyContent: 'center',
							marginTop: 4,
							marginBottom: 5,
							borderBottom: `10px solid ${theme.palette.primary.dark}`,
						}}
					>
						<Logo color={LogoColor.DIGITAL} width={100} />
					</div>
					<div
						style={{
							padding: 5,
						}}
					>
						<LanguageDropdown />
					</div>
					<List>
						{allowedNavBarRoutes?.map((page: Route, index: number) => (
							<React.Fragment key={index + 100}>
								<ListItem button onClick={() => router.push(page.path)}>
									<ListItemText
										primary={
											<div
												style={{
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<span style={{ marginRight: '8px' }}>{page.icon}</span>
												{t[page.name]}
											</div>
										}
									/>
								</ListItem>
							</React.Fragment>
						))}
					</List>
				</div>
			</Drawer>
		</Box>
	);
};

export default Navbar;
