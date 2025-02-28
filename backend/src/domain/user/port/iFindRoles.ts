import { Role } from '../model/role.entity';

export interface IfindRoles {
	findAll(): Promise<Role[]>;
}
