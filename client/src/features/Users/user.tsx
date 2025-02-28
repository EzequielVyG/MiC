import { Event } from '../Events/Event';
import { Role } from '../Roles/role';
import { UserPreference } from '../UserPreference/userPreference';
import { UserAccount } from './userAccount';

export interface User {
	id?: string;
	password?: string;
	email: string;
	status?: string;
	avatar?: string;
	name?: string;
	fechaNacimiento?: Date;
	roles?: Role[];
	favoriteEvents?: Event[];
	preferences?: UserPreference;
	accounts?: UserAccount[];
}
