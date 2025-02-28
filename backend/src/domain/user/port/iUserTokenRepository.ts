import { UserToken } from '../model/userToken.entity';
import { User } from '../model/user.entity';

export interface IUserTokenRepository {
    findByUser(user: User): Promise<UserToken[]>;
    create(userToken: UserToken): Promise<UserToken>;
    deleteToken(userToken: UserToken): Promise<UserToken>;
}

export const IUserTokenRepository = Symbol('IUserTokenRepository');