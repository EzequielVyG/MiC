// Rutas que apareceran en el drawer
import VillaIcon from '@mui/icons-material/Villa';
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import LoginIcon from '@mui/icons-material/Login';
import TodayIcon from '@mui/icons-material/Today';
import InfoIcon from '@mui/icons-material/Info';
import Image from 'next/image';

// eslint-disable-next-line import/no-anonymous-default-export

export enum RoutesVisibility {
	NO,
	PERFIL,
	NAVBAR,
}

export enum LoggedRequire {
	YES,
	NO,
	DONT_CARE,
}

export type Route = {
	path: string;
	name: string;
	icon?: React.ReactElement;
	permission: never[];
	requireLogin: LoggedRequire;
	visible: RoutesVisibility;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default [
	{
		path: '/home/events',
		name: 'events',
		permission: [],
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<LocalActivityIcon sx={{ color: '#8EA2A5' }} />
			</div>
		),
		requireLogin: LoggedRequire.DONT_CARE,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/home/places',
		name: 'places',
		permission: [],
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<VillaIcon sx={{ color: '#8EA2A5' }} />
			</div>
		),
		requireLogin: LoggedRequire.DONT_CARE,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/circuits',
		name: 'circuits',
		permission: [],
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<Image
					priority
					src={require(`./iconCircuit.svg`)}
					alt='Logo de MIC'
					width={21} // Proporcionar el tamaño deseado
					height={21} // Proporcionar el tamaño deseado
				/>
			</div>
		),
		requireLogin: LoggedRequire.DONT_CARE,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/agenda',
		name: 'my_agenda',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.NAVBAR,
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<TodayIcon sx={{ color: '#8EA2A5' }} />
			</div>
		),
	},
	{
		path: '/aboutMIC',
		name: 'aboutMIC',
		permission: [],
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<InfoIcon sx={{ color: '#8EA2A5' }} />
			</div>
		),
		requireLogin: LoggedRequire.DONT_CARE,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/faq',
		name: 'FAQ',
		permission: [],
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<HelpCenterIcon sx={{ color: '#8EA2A5' }} />
			</div>
		),
		requireLogin: LoggedRequire.DONT_CARE,
		visible: RoutesVisibility.NAVBAR,
	},
	{
		path: '/organization',
		name: 'organization',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.NO,
	},
	{
		path: '/organization/detail',
		name: 'neworganization',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.NO,
	},
	{
		path: '/mi_perfil',
		name: 'profile',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.PERFIL,
	},
	{
		path: '/requests',
		name: 'requests',
		permission: [],
		requireLogin: LoggedRequire.YES,
		visible: RoutesVisibility.NO,
	},
	{
		path: '/register',
		name: 'register',
		permission: [],
		requireLogin: LoggedRequire.NO,
		visible: RoutesVisibility.NO,
	},
	{
		path: '/auth/signin',
		name: 'signin',
		permission: [],
		icon: (
			<div style={{ display: 'flex', alignItems: 'end' }}>
				<LoginIcon sx={{ color: '#8EA2A5' }} />
			</div>
		),
		requireLogin: LoggedRequire.NO,
		visible: RoutesVisibility.NAVBAR,
	},
];
