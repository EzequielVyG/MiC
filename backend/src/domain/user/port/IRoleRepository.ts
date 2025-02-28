import { Role } from '../model/role.entity';

export interface IRoleRepository {
    findByName(name: string): Promise<Role>;
    findAll(): Promise<Role[]>;
}

export const IRoleRepository = Symbol('IRoleRepository');
