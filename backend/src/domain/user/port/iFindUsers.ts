import { User } from '../model/user.entity';

export interface IfindUsers {
	findAll(): Promise<User[]>;
	findByProvider(email: string, provider: string, accountID: string): Promise<User>;
}

