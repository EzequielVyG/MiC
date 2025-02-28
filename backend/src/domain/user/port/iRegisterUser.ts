import { UserPreference } from '../model/user-preference.entity';
import { User } from '../model/user.entity';

export interface iRegisterUser {
	register(
		email: string,
		password: string,
		preferences: UserPreference
	): Promise<User>;
	activate(id: string): Promise<User>;
	registerPasarela(
		name: string,
		avatar: string,
		email: string,
		provider: string,
		accountID: string,
		fcmToken: string
	): Promise<User>;
}
