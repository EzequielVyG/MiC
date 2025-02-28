import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role as DomainRole } from 'src/domain/user/model/role.entity';
import { IRoleRepository } from 'src/domain/user/port/IRoleRepository';
import { Role as TypeORMRole } from 'src/infrastructure/user/typeorm/model/role.entity';
import { Repository } from 'typeorm';
import { RoleMapper } from '../mapper/role-typeorm.mapper';

@Injectable()
export class RoleRepository implements IRoleRepository {
    constructor(
        @InjectRepository(TypeORMRole)
        private readonly roleRepository: Repository<TypeORMRole>
    ) { }

	async findAll(): Promise<DomainRole[]> {
		const roles: TypeORMRole[] = await this.roleRepository.find({
		});
		return roles.map((role) => RoleMapper.toDomain(role));
	}

    async findByName(name: string): Promise<DomainRole> {
        const role = await this.roleRepository.findOne({ where: { name: name } });
        return role ? RoleMapper.toDomain(role) : null;
    }
}
