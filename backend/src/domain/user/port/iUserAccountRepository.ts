import { UserAccount } from '../model/userAccount.entity';

export interface IUserAccountRepository {
	create(aUserAccount: UserAccount): Promise<UserAccount>;
	findByEmail(email: string): Promise<UserAccount[]>;
	findAll(): Promise<UserAccount[]>;
}

export const IUserAccountRepository = Symbol('IUserAccountRepository');
