import { UserAccount as DomainUserAccount } from 'src/domain/user/model/userAccount.entity';
import { UserAccount as TypeORMUserAccount } from '../model/userAccount.entity';
import { UserMapper } from './user-typeorm.mapper';

export class UserAccountMapper {
	static toDomain(aUserAccount: TypeORMUserAccount): DomainUserAccount {
		return {
			id: aUserAccount.id,
			accountID: aUserAccount.accountID,
			provider: aUserAccount.provider,
			name: aUserAccount.name,
			email: aUserAccount.email,
			image: aUserAccount.image,
			user: aUserAccount.user ? UserMapper.toDomain(aUserAccount.user) : null,
		};
	}

	static toTypeORM(domainUserAccount: DomainUserAccount): TypeORMUserAccount {
		const typeORMUserAccount = new TypeORMUserAccount();
		typeORMUserAccount.id = domainUserAccount.id;
		typeORMUserAccount.accountID = domainUserAccount.accountID;
		typeORMUserAccount.provider = domainUserAccount.provider;
		typeORMUserAccount.name = domainUserAccount.name;
		typeORMUserAccount.email = domainUserAccount.email;
		typeORMUserAccount.image = domainUserAccount.image;
		typeORMUserAccount.user = domainUserAccount.user
			? UserMapper.toTypeORM(domainUserAccount.user)
			: null;
		return typeORMUserAccount;
	}
}
