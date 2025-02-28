import SideBar from '@/components/SideBar/SideBar';
import GenericTabs from '@/components/Tabs/Tabs';
import { getuserByEmail } from '@/features/Users/hooks/useGetUserByEmailQuery';
import en from '@/locale/en';
import es from '@/locale/es';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupIcon from '@mui/icons-material/Group';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import LoadingSpinner from '@/components/Loading/Loading';
import { Organization } from '@/features/Organizations/Organization';
import { getOrganizationsByUserEmail } from '@/features/Organizations/hooks/useGetByUserEmailQuery';
import StaticLayout from '@/layouts/StaticLayout';
import { hasPermission } from '../../hooks/useUserHasPermissionQuery';
import MyEvents from './my_events';
import MyLinkedAccounts from './my_linked_accounts';
import MyOrganizations from './my_organizations';
import MyPreferences from './my_preferences';
import MyProfile from './my_profile';

import useMyUser from '@/hooks/useMyUser';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const MiPerfil = () => {
	const router = useRouter();

	const { tab } = router.query;
	const { data: session } = useSession();
	const { locale } = router;
	const t: any = locale === 'en' ? en : es;

	const [selectedTab, setSelectedTab] = useState(0);
	const [organizations, setOrganizations] = useState<Organization[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const { setMyUser: setGlobalUser } = useMyUser();

	/* const arrayDeFechas = [
		'2023-10-10', // Fecha 1
		'2023-10-15', // Fecha 2
		'2023-10-20', // Fecha 3
		// Puedes agregar más fechas si lo necesitas
	]; */

	useEffect(() => {
		if (!session) {
			router.push('/auth/signin');
		} else if (session?.user?.email) {
			checkUserPermission(session.user.email);
			fetchUserData(session.user.email);
			fetchOrganizationData(session.user.email);
			setIsLoading(false);
		}

		setSelectedTab(parseInt(tab as string));

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session]);

	const fetchUserData = async (email: string) => {
		try {
			const userResponse = await getuserByEmail(email);
			setGlobalUser(userResponse.data);
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	};

	const fetchOrganizationData = async (email: string) => {
		try {
			const organizationsResponse = await getOrganizationsByUserEmail(email);
			if (organizationsResponse.statusCode === 200)
				setOrganizations(organizationsResponse.data);
		} catch (error) {
			console.error('Error fetching organization:', error);
		}
	};

	const checkUserPermission = async (email: string) => {
		const response = await hasPermission(email, 'updateOwn', 'user');
		if (response.statusCode === 500) {
			router.replace('/permissionDenied');
		}
		setIsLoading(false);
	};

	const handleTabSelect = async (index: number) => {
		await router.replace({
			pathname: '/mi_perfil',
			query: { tab: index },
		});
		setSelectedTab(index);
	};

	const tabs = [
		{
			label: t['profile'],
			content: <MyProfile email={session?.user?.email} />,
			icon: <PersonIcon sx={{ color: '#8EA2A5' }} />,
			hidden: false,
		},
		{
			label: t['my_accounts'],
			content: <MyLinkedAccounts email={session?.user?.email} />,
			icon: <InsertLinkIcon sx={{ color: '#8EA2A5' }} />,
			hidden: false,
		},
		{
			label: t['my_organizations'],
			content: <MyOrganizations myUser={session?.user} />,
			icon: <GroupIcon sx={{ color: '#8EA2A5' }} />,
			hidden: false,
		},
		{
			label: t['my_events'],
			content: (
				<MyEvents />
			),
			icon: <EventAvailableIcon sx={{ color: '#8EA2A5' }} />,
			hidden: organizations.length < 1,
		},
		{
			label: t['preferences'],
			content: <MyPreferences />,
			icon: <SettingsIcon sx={{ color: '#8EA2A5' }} />,
			hidden: false,
		},
		/* const uniqueUsers = someUsers.filter(aUser => {

	  if (idSet.has(aUser.id)) {
		  return false;
	  }

	  idSet.add(aUser.id);
	  return true;
  }); */
	];

	/* const handleCardClick = (id: string) => {
		router.push(`/organization/edit/${id}`);
	}; */

	/* const handleTabSelect = async (index: number) => {
		await setSelectedTab(index);
		router.push({
			pathname: '/mi_perfil',
			query: { tab: index },
		});
	}; */

	return (
		<StaticLayout>
			{isLoading ? (
				<LoadingSpinner />
			) : (
				<>
					<GenericTabs
						tabs={tabs}
						sx={{
							display: { xs: 'flex', lg: 'none' },
							overflowX: 'auto',
							whiteSpace: 'nowrap',
						}}
						onTabChange={handleTabSelect}
						selected={selectedTab}
					/>

					<SideBar
						tabs={tabs}
						onTabSelect={handleTabSelect}
						selectedTab={selectedTab}
						sx={{ display: { xs: 'none', lg: 'flex' } }}
					/>
				</>
			)}
		</StaticLayout>
	);
};

export default MiPerfil;
