import { User } from '../model/user.entity';

export interface IDeleteLogicUser {
	deleteLogic(id: string): Promise<User>;
}
