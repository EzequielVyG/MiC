import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../port/iUserRepository';
import { iLogoutUser } from '../port/iLogoutUser';
import { IUserTokenRepository } from '../port/iUserTokenRepository';
import { UserToken } from '../model/userToken.entity';

@Injectable()
export class LogoutUser implements iLogoutUser {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
		@Inject(IUserTokenRepository)
		private userTokenRepository: IUserTokenRepository
	) { }

	async logout(email: string, token: string) {
		const userSearched = await this.userRepository.findByEmail(email);
		const aUserToken = new UserToken();
		aUserToken.user = userSearched;
		aUserToken.token = token;
		await this.userTokenRepository.deleteToken(aUserToken);
	}
}
