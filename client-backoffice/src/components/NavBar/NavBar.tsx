import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import { User } from '@/features/Users/user';
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
import Logo from '../Logo/Logo'; // Ajusta la ruta a tu componente Logo
import LogoColor from '../Logo/LogoTypes';

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
	// ... otras rutas
];

const Navbar: React.FC = () => {
	const { data: session } = useSession();
	const theme = useTheme(); // Obtiene el objeto theme
	const router = useRouter();

	const [userData, setUserData] = useState<User | null>(null);
	const [allowedNavBarRoutes, setAllowedNavBarRoutes] =
		useState<Route[]>(initialPerfilRoutes);
	const [allowedPerfilRoutes, setAllowedPerfilRoutes] =
		useState<Route[]>(initialPerfilRoutes);

	const [menuOpen, setMenuOpen] = useState(false);

	useEffect(() => {
		if (
			(!session || new Date(session.expires) < new Date()) &&
			router.pathname !== '/auth/signin' &&
			router.pathname !== '/restorePassword' &&
			router.pathname !== '/restorePassword/[id]'
		) {
			router.replace({
				pathname: '/auth/signin',
				query: { expired: true },
			});
		} else {
			getUserInfo(session?.user?.email);
			getUserAllowedRoutes();
		}
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
		const filteredNavBarRoutes: Route[] = Routes.filter((route: any) => {
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

		const filteredPerfilRoutes: Route[] = Routes.filter((route: any) => {
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
						backgroundColor: 'white', //#dfcae0
					}}
					sx={{
						justifyContent: { md: 'space-between', xs: 'space-between' },
					}}
				>
					{/* Box de Menu de celular */}
					<Box
						sx={{
							display: {
								xs: 'block', md: 'block', lg: 'none',
								xl: 'none',
							}, // Se muestra en xs y s
						}}
					>
						<NavBarButton onClick={handleToggleMenu}>
							<MenuIcon sx={{ color: '#AEAEAE' }} />
						</NavBarButton>
					</Box>

					<Link
						onClick={() => router.push('/home')}
						style={{ display: 'flex', alignItems: 'center' }}
					>
						<Logo color={LogoColor.DIGITAL_PHRASE} width={200} />
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
								// marginRight: '8%',
							},
						}}
					>
						{/* Botones de navegación centrados */}
						{userData?.roles?.length === 1 &&
						userData.roles.find((aRole) => aRole.name === 'CONSUMIDOR') ? (
							<div></div>
						) : (
							allowedNavBarRoutes
								?.filter((page: Route) => {
									if (
										userData?.roles?.some((aRole) => aRole.name === 'ADMIN')
									) {
										return true;
									}

									return !(
										userData?.roles?.some(
											(aRole) => aRole.name === 'GESTION_MIC'
										) && ['/users', '/organizations', '/events'].includes(page.path)
									);
								})
								.map((page: Route, index: number) => (
									<NavBarButton
										key={index}
										onClick={() => router.push(page.path)}
									>
										<div style={{ display: 'flex', alignItems: 'center' }}>
											<span style={{ marginRight: '8px' }}>{page.icon}</span>
											{page.name}
										</div>
									</NavBarButton>
								))
						)}
						{/* Menú desplegable de idioma y otros elementos a la derecha */}
					</Box>
					{userData && session && new Date(session.expires) > new Date() && (
						<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
							{userData && (
								<AvatarMenu
									userData={userData!}
									routes={allowedPerfilRoutes}
								></AvatarMenu>
							)}
						</div>
					)}
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
					<List>
						{userData?.roles?.length === 1 &&
						userData.roles.find((aRole) => aRole.name === 'CONSUMIDOR') ? (
							<div></div>
						) : (
							allowedNavBarRoutes?.map((page: Route, index: number) => (
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
													<span style={{ marginRight: '8px' }}>
														{page.icon}
													</span>
													{page.name}
												</div>
											}
										/>
									</ListItem>
								</React.Fragment>
							))
						)}
					</List>
				</div>
			</Drawer>
		</Box>
	);
};

export default Navbar;
