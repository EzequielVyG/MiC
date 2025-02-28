import { User } from '../model/user.entity';

export interface iUpdateUserPassword {
    changePassword(email: string, actualPassword: string, newPassword: string, checkNewPassword: string): Promise<User>;
}