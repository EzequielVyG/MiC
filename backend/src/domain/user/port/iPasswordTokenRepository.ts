import { PasswordToken } from '../model/passwordToken.entity';
import { User } from '../model/user.entity';

export interface IPasswordTokenRepository {
    // findAll(): Promise<User[]>;
    // findByID(id: string): Promise<User>;
    findByToken(aToken: string): Promise<PasswordToken>;
    findByUserAndStatus(user: User, status: string): Promise<PasswordToken>;
    create(aUser: PasswordToken): Promise<PasswordToken>;
    update(aUser: PasswordToken): Promise<PasswordToken>;
}

export const IPasswordTokenRepository = Symbol('IPasswordTokenRepository');