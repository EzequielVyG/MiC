import { Inject, Injectable } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IUserRepository } from '../port/iUserRepository';
const normalizeEmail = require('normalize-email');

require('dotenv').config();

import { UserAccount } from '../model/userAccount.entity';
import { iLinkAccount } from '../port/iLinkAccount';
import { IUserAccountRepository } from '../port/iUserAccountRepository';

@Injectable()
export class LinkAccount implements iLinkAccount {

    constructor(
        @Inject(IUserRepository)
        private userRepository: IUserRepository,
        @Inject(IUserAccountRepository)
        private userAccountRepository: IUserAccountRepository
    ) { }

    async linkAccountToUser(userEmail: string, accountEmail: string, accountImage: string, accountName: string, provider: string, accountID: string): Promise<User> {
        const aUser = await this.getUserByEmail(userEmail);
        if (!aUser) {
            throw new Error('No se puede linkear una cuenta a un usuario que no existe');
        }


        const usersAccounts = await this.userAccountRepository.findAll()
        const accountLinkedPreviusly = usersAccounts.some((account) => account.provider === provider && account.accountID === accountID);
        if (accountLinkedPreviusly) {
            throw new Error('La cuenta de la pasarela federada ya fue linkeada a otro usuario');
        }

        const pasarelaAlreadyLined = aUser.accounts.some((account) => account.provider === provider);
        if (pasarelaAlreadyLined) {
            throw new Error('El usuario ya tiene una cuenta registrada con esta pasarela');
        }

        const aUserAccount = new UserAccount();
        aUserAccount.email = accountEmail;
        aUserAccount.image = accountImage;
        aUserAccount.name = accountName;
        aUserAccount.provider = provider;
        aUserAccount.accountID = accountID
        aUserAccount.user = aUser;
        await this.userAccountRepository.create(aUserAccount);

        return await this.getUserByEmail(userEmail);
    }

    private async getUserByEmail(email: string): Promise<User | null> {
        const aUser = new User();
        aUser.email = normalizeEmail(email);
        return this.userRepository.findByEmail(aUser.email);
    }
}

