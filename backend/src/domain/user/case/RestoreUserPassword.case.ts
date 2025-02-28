import { Inject, Injectable } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';
const normalizeEmail = require('normalize-email');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");

require('dotenv').config();

import { EmailService } from '../../../util/email.service';
import { PasswordToken } from '../model/passwordToken.entity';
import { IPasswordTokenRepository } from '../port/iPasswordTokenRepository';
import { iRestoreUserPassword } from '../port/iRestoreUserPassword';
const Email = new EmailService();

@Injectable()
export class RestoreUserPassword implements iRestoreUserPassword {
    constructor(
        @Inject(IUserRepository)
        private userRepository: IUserRepository,
        @Inject(IPasswordTokenRepository)
        private passwordTokenRepository: IPasswordTokenRepository
    ) { }

    async sendPasswordToken(email: string): Promise<User> {
        try {
            if (!email) throw new Error("Email required!");

            email = normalizeEmail(email);

            const aUserComplete = await this.userRepository.findByEmail(email);

            const aPasswordToken = await this.verifyAndGenerateToken(aUserComplete);

            await Email.sendRestorePasswordEmail(email, aPasswordToken.token);
            return aPasswordToken;

        } catch (error: any) {
            throw new Error(error);
        }
    }

    async verifyAndGenerateToken(aUser: User) {
        let aToken;
        try {
            // Verificar si tiene un token valido
            const newUser = new User();
            newUser.id = aUser.id;
            aToken = await this.passwordTokenRepository.findByUserAndStatus(newUser, 'valido');

            //Si existe lo retorno 
            if (aToken !== null) {
                // Verificar expiración de token
                const isExpired = await this.checkTokenExpiration(aToken.token);
                if (!isExpired) {
                    return aToken;
                }
                // Si está expirado le actualizo el estado
                aToken.status = 'invalido';
                this.passwordTokenRepository.update(aToken);
            }

            // Si no existe, genero uno y lo retorno
            aToken = {
                user: aUser,
                token: (await this.generatePasswordToken(aUser.email)),
                status: 'valido'
            }

            const aPasswordTokenEntity: PasswordToken = await this.passwordTokenRepository.create(aToken);
            return aPasswordTokenEntity;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    checkTokenExpiration(aToken: string) {
        try {
            jwt.verify(aToken, process.env.JWT_SECRET);
            return false;
        } catch (error: any) {
            if (error == "TokenExpiredError: jwt expired") { return true }
        }
    }

    async generatePasswordToken(aEmail: string) {
        const token = jwt.sign({ email: aEmail }, process.env.JWT_SECRET, {
            expiresIn: process.env.PASSWORDTK_EXPIRATION,
        });
        return token;
    }

    async getPasswordTokenData(aToken: string) {
        const passwordTokenEntity = await this.passwordTokenRepository.findByToken(aToken);
        return passwordTokenEntity;
    }

    async restorePassword(aEmail: string, newPassword: string, passwordToken: string): Promise<any> {
        try {
            //Hash password
            const hashedPassword: string = await bcrypt.hash(
                newPassword,
                saltRounds
            );

            await this.changeTkStatus(passwordToken, 'invalido');

            const aUser: any = await this.userRepository.findByEmail(normalizeEmail(aEmail));
            aUser.password = hashedPassword;
            const aUserUpdated = await this.userRepository.update(aUser);

            return aUserUpdated;
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async changeTkStatus(aToken: string, newStatus: string) {
        let aTokenEntity: any = await this.passwordTokenRepository.findByToken(aToken);

        aTokenEntity.status = newStatus;
        aTokenEntity = await this.passwordTokenRepository.update(aTokenEntity);
        return aTokenEntity
    }

    isEmail(email: string): boolean {
        const regexmail = new RegExp(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
        return regexmail.test(email);
    }

    isValidPassword(password: string): boolean {
        const regularExpression =
            /^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
        return regularExpression.test(password);
    }
}