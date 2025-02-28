import { Inject, Injectable } from '@nestjs/common';
import { IfindContrasenia } from '../port/iFindContrasenia';
import { IUserRepository } from '../port/iUserRepository';
const normalizeEmail = require('normalize-email');

@Injectable()
export class FindByContrasenia implements IfindContrasenia {
	constructor(
		@Inject(IUserRepository)
		private readonly userRepository: IUserRepository
	) { }

	async findByContrasenia(email: string): Promise<boolean> {
		email = normalizeEmail(email);
		return this.userRepository.findByContrasenia(email);
	}
}
