import { Inject, Injectable } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IDeleteLogicUser } from '../port/iDeleteLogicUser';
import { IUserRepository } from '../port/iUserRepository';

@Injectable()
export class DeleteLogicUser implements IDeleteLogicUser {
	constructor(
		@Inject(IUserRepository)
		private readonly userRepository: IUserRepository
	) {}

	async deleteLogic(id: string): Promise<User> {
		return this.userRepository.deleteLogic(id);
	}
}
