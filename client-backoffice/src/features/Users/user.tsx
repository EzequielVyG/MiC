import { Role } from '../Roles/role';

export interface User {
	id?: string;
	password: string;
	email: string;
	status?: string;
	avatar?: string;
	name?: string;
	fechaNacimiento?: Date;
	roles?: Role[];
}
