import { User } from '../model/user.entity';

export interface iRestoreUserPassword {
    sendPasswordToken(email: string): Promise<User>;
}