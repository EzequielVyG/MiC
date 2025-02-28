import { Inject, Injectable } from '@nestjs/common';
import { iSaveUserToken } from '../port/iSaveUserToken';
import { IUserRepository } from '../port/iUserRepository';
import { UserToken } from '../model/userToken.entity';
import { IUserTokenRepository } from '../port/iUserTokenRepository';

@Injectable()
export class SaveUserToken implements iSaveUserToken {
    constructor(
        @Inject(IUserRepository)
        private userRepository: IUserRepository,
        @Inject(IUserTokenRepository)
        private userTokenRepository: IUserTokenRepository
    ) { }

    async saveUserToken(email: string, token: string): Promise<UserToken> {
        const userSearched = await this.userRepository.findByEmail(email);

        const aUserToken = new UserToken();
        aUserToken.user = userSearched;

        if (token) {
            aUserToken.token = token;
            await this.userTokenRepository.create(aUserToken);
        }

        return aUserToken
    }
}
