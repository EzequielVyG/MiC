import { User } from '../model/user.entity';

export interface IUserRepository {
	findUserByLinkedAccount: any;
	findAll(): Promise<User[]>;
	findByID(id: string): Promise<User>;
	findByEmail(email: string): Promise<User>;
	save(aUser: User): Promise<User>;
	update(aUser: User): Promise<User>;
	deleteLogic(id: string): Promise<User>;
	findByContrasenia(email: string): Promise<boolean>;
	findUserByLinkedAccountEmail(email: string, provider: string): Promise<User>;
	findUserByLinkedAccountId(accountID: string, provider: string): Promise<User>;
}

export const IUserRepository = Symbol('IUserRepository');
