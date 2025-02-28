import { Inject, Injectable } from '@nestjs/common';
import { Role } from '../model/role.entity';
import { IRoleRepository } from '../port/IRoleRepository';
import { IfindRoles } from '../port/iFindRoles';

@Injectable()
export class FindRoles implements IfindRoles {
	constructor(
		@Inject(IRoleRepository)
		private readonly userRepository: IRoleRepository
	) {}

	async findAll(): Promise<Role[]> {
		return this.userRepository.findAll();
	}
}
