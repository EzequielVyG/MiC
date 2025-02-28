import { Inject, Injectable } from '@nestjs/common';
import { status } from '../model/status.enum';
import { User } from '../model/user.entity';
import { UserToken } from '../model/userToken.entity';
import { iLoginUser } from '../port/iLoginUser';
import { IUserRepository } from '../port/iUserRepository';
import { IUserTokenRepository } from '../port/iUserTokenRepository';
const normalizeEmail = require('normalize-email');
const bcrypt = require('bcrypt');

@Injectable()
export class LoginUser implements iLoginUser {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
		@Inject(IUserTokenRepository)
		private userTokenRepository: IUserTokenRepository
	) { }

	async login(email: string, password: string, token: string): Promise<User> {
		const aUser = await this.getUserByEmail(email);

		if (aUser) {
			this.checkUserStatus(aUser);

			if (await this.comparePassword(password, aUser.password)) {
				return this.handleLogin(token, aUser);
			}
		}

		throw new Error('Login incorrecto');
	}

	async loginMIC(email: string, password: string): Promise<User> {
		const aUser = await this.getUserByEmail(normalizeEmail(email));

		if (aUser) {
			this.checkUserStatus(aUser);

			if (await this.comparePassword(password, aUser.password)) {
				if (this.hasAdminOrGestionMICRole(aUser)) {
					return aUser;
				} else {
					throw new Error(
						'No tiene permisos para loguearse en la gestion de MIC'
					);
				}
			}
		}

		throw new Error('Login incorrecto');
	}

	private async getUserByEmail(email: string): Promise<User | null> {
		const aUser = new User();
		aUser.email = normalizeEmail(email);
		return this.userRepository.findByEmail(aUser.email);
	}

	private checkUserStatus(user: User): void {
		if (user.status === status.PENDING) {
			throw new Error(
				'Email pendiente de activacion. Por favor, revise su casilla de correo electrónico'
			);
		}
	}

	private async comparePassword(
		password: string,
		hashedPassword: string
	): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	private async handleLogin(token: string, user: User): Promise<User> {
		const aUserToken = new UserToken();
		aUserToken.user = user;

		if (token) {
			aUserToken.token = token;
			try {
				await this.userTokenRepository.create(aUserToken);
			} catch (error) {
			}
		}

		return user;
	}

	private hasAdminOrGestionMICRole(user: User): boolean {
		return user.roles.some(
			(rol) => rol.name === 'ADMIN' || rol.name === 'GESTION_MIC'
		);

	}
}
