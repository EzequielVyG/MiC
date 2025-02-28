import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { status } from 'src/domain/user/model/status.enum';
import { User as DomainUser } from 'src/domain/user/model/user.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { User as TypeORMUser } from 'src/infrastructure/user/typeorm/model/user.entity';
import { Repository } from 'typeorm';
import { UserMapper } from '../mapper/user-typeorm.mapper';
import { UserPreference } from '../model/user-preference.entity';
import { UserAccount as TypeORMUserAccount } from '../model/userAccount.entity';

@Injectable()
export class UserRepository implements IUserRepository {
	constructor(
		@InjectRepository(TypeORMUser)
		private readonly userRepository: Repository<TypeORMUser>,
		@InjectRepository(UserPreference)
		private readonly preferenceRepository: Repository<UserPreference>,
		@InjectRepository(TypeORMUserAccount)
		private readonly userAccountRepository: Repository<TypeORMUserAccount>
	) { }
	findUserByLinkedAccount: any;


	async findUserByLinkedAccountId(accountID: string, provider: string): Promise<DomainUser> {
		const userAccount = await this.userAccountRepository.createQueryBuilder('user_accounts')
			.leftJoinAndSelect('user_accounts.user', 'user')
			.where('user_accounts.account_id = :accountID', { accountID })
			.andWhere('user_accounts.provider = :provider', { provider })
			.getOne();

		if (!userAccount) {
			return null; // No se encontró la cuenta vinculada
		}

		const user = await this.userRepository.findOne({
			where: { id: userAccount.user.id },
			relations: this.getRelations(),
		});

		return user ? UserMapper.toDomain(user) : null;
	}


	async findUserByLinkedAccountEmail(email: string, provider: string): Promise<DomainUser> {
		const userAccount = await this.userAccountRepository.createQueryBuilder('user_accounts')
			.leftJoinAndSelect('user_accounts.user', 'user')
			.where('user_accounts.email = :email', { email })
			.andWhere('user_accounts.provider = :provider', { provider })
			.getOne();

		if (!userAccount) {
			return null; // No se encontró la cuenta vinculada
		}

		const user = await this.userRepository.findOne({
			where: { id: userAccount.user.id },
			relations: this.getRelations(),
		});

		return user ? UserMapper.toDomain(user) : null;
	}

	// Resto del código de la clase UserRepository
	// ...


	private getRelations() {
		return [
			'roles',
			'preferences',
			'preferences.categories',
			'accounts',
			'favoriteEvents',
			'favoriteEvents.photos',
		];
	}
	async save(aUser: DomainUser): Promise<DomainUser> {
		const typeORMUser = UserMapper.toTypeORM(aUser);

		const typeORMSavedUser = await this.userRepository.manager.transaction(
			async (transactionalPlaceManager) => {
				try {
					const savedUser = await transactionalPlaceManager.save(typeORMUser);
					savedUser.preferences.user = { ...savedUser, preferences: null };

					await transactionalPlaceManager.save(
						UserPreference,
						savedUser.preferences
					);

					return savedUser;
				} catch (error) {
					throw new Error(error.message);
				}
			}
		);

		return UserMapper.toDomain(typeORMSavedUser);
	}

	async findByID(id: string): Promise<DomainUser> {
		const user = await this.userRepository.findOne({
			where: { id: id },
			relations: this.getRelations(),
		});
		return user ? UserMapper.toDomain(user) : null;
	}

	async findByEmail(email: string): Promise<DomainUser> {
		const user = await this.userRepository.findOne({
			where: { email: email },
			relations: this.getRelations(),
		});
		return user ? UserMapper.toDomain(user) : null;
	}

	async findAll(): Promise<DomainUser[]> {
		const users = await this.userRepository.find({
			withDeleted: true,
			relations: this.getRelations(),
		});
		return users.map((user) => {
			return UserMapper.toDomain(user);
		});
	}

	async update(aUser: DomainUser): Promise<DomainUser> {
		const typeORMUser = UserMapper.toTypeORM(aUser);
		const typeORMUpdatedUser = await this.userRepository.manager.transaction(
			async (transactionalPlaceManager) => {
				try {
					const updatedUser = await transactionalPlaceManager.save(typeORMUser);
					if (!updatedUser.preferences) {
						updatedUser.preferences = new UserPreference();
					}
					updatedUser.preferences.user = { ...updatedUser, preferences: null };

					await transactionalPlaceManager.save(
						UserPreference,
						updatedUser.preferences
					);

					const aPreference = await this.preferenceRepository.findOne({
						where: { user: { id: updatedUser.id } },
					});
					updatedUser.preferences.id = aPreference
						? aPreference.id
						: updatedUser.preferences.id ? updatedUser.preferences.id : "";

					await transactionalPlaceManager.save(
						UserPreference,
						updatedUser.preferences
					);
					return updatedUser;
				} catch (error) {
					throw new Error(error.message);
				}
			}
		);


		return UserMapper.toDomain(typeORMUpdatedUser);
	}

	async findByContrasenia(email: string): Promise<boolean> {
		const user = await this.userRepository.findOne({
			where: { email: email },
			relations: ['roles'],
		});

		if (user) {
			return user.password !== null;
		}

		return false;
	}

	async deleteLogic(id: string): Promise<DomainUser> {
		const typeORMUser = await this.userRepository.findOne({ where: { id: id } });

		if (!typeORMUser) {
			throw new Error(`Usuario con id ${id} no existe.`);
		}

		await this.userRepository.softRemove(typeORMUser);
		typeORMUser.status = status.DELETED;

		const typeORMUpdatedUser = await this.userRepository.save(typeORMUser);

		return UserMapper.toDomain(typeORMUpdatedUser);
	}
}
