import { UserPreference } from '../../typeorm/model/user-preference.entity';

export class RegisterUserInput {
	email: string;
	password: string;
	preferences: UserPreference;
}
