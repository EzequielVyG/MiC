import { User } from '../model/user.entity';

export interface iLoginUser {
	login(email: string, password: string, token: string): Promise<User>;
	loginMIC(email: string, password: string): Promise<User>;
}
