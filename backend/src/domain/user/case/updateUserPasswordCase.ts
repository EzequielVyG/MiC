import { Injectable, Inject } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';

import { RegisterUser } from './registerUser.case';
import { iUpdateUserPassword } from '../port/iUpdateUserPassword';

const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class UpdateUserPassword implements iUpdateUserPassword {
    constructor(
        @Inject(IUserRepository)
        private userRepository: IUserRepository,
        private registerUser: RegisterUser
    ) { }

    async changePassword(email: string, actualPassword: string, newPassword: string, checkNewPassword: string): Promise<User> {
        const userSearched = await this.userRepository.findByEmail(email);

        if (!userSearched) {
            throw new Error('Usuario inexistente');
        }

        if (!(await bcrypt.compare(actualPassword, userSearched.password))) {
            throw new Error('Contraseña incorrecta');
        }

        if (newPassword != checkNewPassword) {
            throw new Error("Las claves deben ser iguales");
        }

        if (!this.registerUser.isValidPassword(newPassword)) {
			throw new Error('Clave invalida');
		}
        

		const hashedPassword: string = await bcrypt.hash(newPassword, saltRounds);
		userSearched.password = hashedPassword;

        const userUpdated = await this.userRepository.update(userSearched);
        return userUpdated;

    }
}
