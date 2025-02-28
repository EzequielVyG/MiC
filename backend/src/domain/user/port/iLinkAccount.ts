import { User } from '../model/user.entity';

export interface iLinkAccount {
    linkAccountToUser(userEmail: string, accountEmail: string, accountImage: string, accountName: string, provider: string, accountID: string): Promise<User>;
}