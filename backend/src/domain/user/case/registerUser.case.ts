import { Inject, Injectable } from '@nestjs/common';
import { status } from '../model/status.enum';
import { User } from '../model/user.entity';
import { iRegisterUser } from '../port/iRegisterUser';
import { IUserRepository } from '../port/iUserRepository';
const normalizeEmail = require('normalize-email');
const bcrypt = require('bcrypt');
const saltRounds = 10;

require('dotenv').config();

import { EmailService } from '../../../util/email.service';
import { UserPreference } from '../model/user-preference.entity';
import { UserAccount } from '../model/userAccount.entity';
import { IRoleRepository } from '../port/IRoleRepository';
import { IUserAccountRepository } from '../port/iUserAccountRepository';
import { UserToken } from '../model/userToken.entity';
import { IUserTokenRepository } from '../port/iUserTokenRepository';
const Email = new EmailService();

@Injectable()
export class RegisterUser implements iRegisterUser {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
		@Inject(IRoleRepository)
		private roleRepository: IRoleRepository,
		@Inject(IUserAccountRepository)
		private userAccountRepository: IUserAccountRepository,
		@Inject(IUserTokenRepository)
		private userTokenRepository: IUserTokenRepository
	) { }

	async activate(id: string): Promise<User> {
		const aUser = await this.userRepository.findByID(id);
		if (!aUser) {
			throw new Error('Usuario no existe');
		}

		if (aUser.status === status.ACTIVE) {
			throw new Error('Usuario ya activado');
		}

		aUser.status = status.ACTIVE;

		this.userRepository.update(aUser);

		return aUser;
	}

	async register(
		email: string,
		password: string,
	): Promise<User> {
		const existingUser = await this.userRepository.findByEmail(
			normalizeEmail(email)
		);

		if (existingUser) {
			throw new Error(
				'El usuario ya está registrado. Por favor, inicie sesión o utilice otro correo electrónico.'
			);
		}

		const aUser = new User();
		aUser.email = normalizeEmail(email);

		if (!this.isEmail(aUser.email)) {
			throw new Error('Email inválido');
		}

		if (!this.isValidPassword(password)) {
			throw new Error('Clave inválida');
		}

		// if (preferences.initialContext !== '') {
		// 	if (!ContextEnum[preferences.initialContext]) {
		// 		throw new Error('Contexto inválido');
		// 	}
		// 	preferences.initialContext = ContextEnum[preferences.initialContext];
		// }

		const hashedPassword: string = await bcrypt.hash(password, saltRounds);
		aUser.password = hashedPassword;

		aUser.status = status.PENDING;

		const consumidorRole = await this.roleRepository.findByName('CONSUMIDOR');
		aUser.roles = [consumidorRole];


		aUser.preferences = new UserPreference();

		aUser.favoriteEvents = [];

		const aUserEntity = await this.userRepository.save(aUser);

		await Email.sendActivateUserEmail(aUserEntity.email, aUserEntity.id);
		return aUserEntity;
	}

	//para registrarse con google, twitter, twitch y tiktok
	async registerPasarela(
		name: string,
		avatar: string,
		email: string,
		provider: string,
		accountID: string,
		fcmToken: string
	): Promise<User> {

		if (!provider) {
			throw new Error('No hay un provider definido');
		}
		// Busco usuario de cuenta por account ID o email
		let userWithThisAccount: User | undefined;

		if (accountID) {
			userWithThisAccount = await this.userRepository.findUserByLinkedAccountId(accountID, provider);
		} else if (email) {
			userWithThisAccount = await this.userRepository.findUserByLinkedAccountEmail(email, provider);
		}

		if (!userWithThisAccount) {

			if (!email) {
				throw new Error("No se puede registrar una pasarela federada nueva sin email")
			}

			// Registro de nuevo usuario si no existe
			let userToLink = await this.userRepository.findByEmail(normalizeEmail(email));
			if (userToLink === null) {
				userToLink = await this.registerNewUser(email, name, avatar, null)
			}

			// Linkeo a la cuenta 
			await this.linkAccount(email, avatar, name, provider, accountID, userToLink);

			userWithThisAccount = userToLink

		}

		userWithThisAccount = await this.userRepository.findByID(userWithThisAccount.id)
		if (userWithThisAccount.status !== status.ACTIVE) {
			userWithThisAccount.status = status.ACTIVE;
			await this.userRepository.save(userWithThisAccount);
		}

		if (fcmToken) {
			const aUserToken = new UserToken();
			aUserToken.user = userWithThisAccount;
			aUserToken.token = fcmToken;
			try {
				await this.userTokenRepository.create(aUserToken);
			} catch (error) {
			}
		}
		return userWithThisAccount
	}

	async registerNewUser(email: string, name: string, avatar: string, password: string | null): Promise<User> {
		const aUser = new User();
		aUser.email = normalizeEmail(email);

		if (!this.isEmail(aUser.email)) {
			throw new Error('Email invalido');
		}

		aUser.name = name;
		aUser.avatar = avatar;
		aUser.password = password;

		aUser.preferences = new UserPreference();
		aUser.favoriteEvents = [];
		aUser.status = status.ACTIVE;

		const consumidorRole = await this.roleRepository.findByName('CONSUMIDOR');
		aUser.roles = [consumidorRole];
		return await this.userRepository.save(aUser);
	}

	async linkAccount(email: string, image: string, name: string, provider: string, accountID: string, user: User): Promise<UserAccount> {
		const aUserAccount = new UserAccount();
		aUserAccount.email = email;
		aUserAccount.image = image;
		aUserAccount.name = name;
		aUserAccount.provider = provider;
		aUserAccount.accountID = accountID
		aUserAccount.user = user;

		return await this.userAccountRepository.create(aUserAccount);
	}

	isEmail(email: string): boolean {
		const regexmail = new RegExp(
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		);
		return regexmail.test(email);
	}

	isValidPassword(password: string): boolean {
		return password.length >= 8;
		/* 		const regularExpression =
			/^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
		return regularExpression.test(password); */
	}
}
