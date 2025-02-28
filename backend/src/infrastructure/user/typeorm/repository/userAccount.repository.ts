import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAccount as DomainUserAccount } from 'src/domain/user/model/userAccount.entity';
import { IUserAccountRepository } from 'src/domain/user/port/iUserAccountRepository';
import { Repository } from 'typeorm';
import { UserAccountMapper } from '../mapper/user-account.typeorm.mapper';
import { UserAccount as TypeORMUserAccount } from '../model/userAccount.entity';

@Injectable()
export class UserAccountRepository implements IUserAccountRepository {
	constructor(
		@InjectRepository(TypeORMUserAccount)
		private readonly userAccountRepository: Repository<TypeORMUserAccount>
	) { }
	async findAll(): Promise<DomainUserAccount[]> {
		const usersAccounts = await this.userAccountRepository.find();
		return usersAccounts.map((account) => UserAccountMapper.toDomain(account));
	}

	async create(
		aUserAccount: DomainUserAccount,
	): Promise<DomainUserAccount> {
		const typeORMUserAccount = UserAccountMapper.toTypeORM(aUserAccount);
		const savedUserAccount = await this.userAccountRepository.save(typeORMUserAccount);
		return UserAccountMapper.toDomain(savedUserAccount);
	}

	async findByEmail(email: string): Promise<DomainUserAccount[]> {
		const usersAccounts = await this.userAccountRepository.find({
			where: { email: email },
		});
		return usersAccounts.map((account) => UserAccountMapper.toDomain(account));
	}
}
