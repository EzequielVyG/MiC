import { UserToken } from '../model/userToken.entity';

export interface iSaveUserToken {
    saveUserToken(email: string, token: string): Promise<UserToken>;
}
