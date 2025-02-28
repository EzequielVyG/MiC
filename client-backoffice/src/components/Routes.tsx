// Rutas que apareceran en el drawer
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import CorporateFareIcon from "@mui/icons-material/CorporateFare";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalActivityIcon from '@mui/icons-material/LocalActivity';
import LoginIcon from "@mui/icons-material/Login";
import ModeOfTravelIcon from "@mui/icons-material/ModeOfTravel";
import VillaIcon from "@mui/icons-material/Villa";

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
    path: "/organizations/requests",
    name: "Administrar organizaciones",
    icon: (
      <div style={{ display: "flex", alignItems: "end" }}>
        <CorporateFareIcon sx={{ color: "#8EA2A5" }} />
        <AdminPanelSettingsIcon sx={{ color: "#8EA2A5" }} />
      </div>
    ),
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NAVBAR,
  },
  {
    path: "/organizations",
    name: "Ver organizaciones",
    icon: (
      <div style={{ display: "flex", alignItems: "end" }}>
        <CorporateFareIcon sx={{ color: "#8EA2A5" }} />
        <FormatListBulletedIcon sx={{ color: "#8EA2A5" }} />
      </div>
    ),
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NAVBAR,
  },
  {
    path: "/places",
    name: "Lugares",
    icon: (
      <div style={{ display: "flex", alignItems: "end" }}>
        <VillaIcon sx={{ color: "#8EA2A5" }} />
      </div>
    ),
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NAVBAR,
  },
  {
    path: "/circuits",
    name: "Circuitos",
    icon: (
      <div style={{ display: "flex", alignItems: "end" }}>
        <ModeOfTravelIcon sx={{ color: "#8EA2A5" }} />
      </div>
    ),
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NAVBAR,
  },
  {
    path: "/users",
    name: "Usuarios",
    icon: (
      <div style={{ display: "flex", alignItems: "end" }}>
        <AccountCircleIcon sx={{ color: "#8EA2A5" }} />
      </div>
    ),
    permission: [],
    requireLogin: LoggedRequire.YES,
    visible: RoutesVisibility.NAVBAR,
  },
  {
		path: '/events',
		name: 'Eventos',
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
    path: "/auth/signin",
    name: "Inicio de sesión",
    icon: (
      <div style={{ display: "flex", alignItems: "end" }}>
        <LoginIcon sx={{ color: "#8EA2A5" }} />
      </div>
    ),
    permission: [],
    requireLogin: LoggedRequire.NO,
    visible: RoutesVisibility.NAVBAR,
  },
];
