import { UserToken as DomainUserToken } from 'src/domain/user/model/userToken.entity';
import { UserToken as TypeORMUserToken } from '../model/userToken.entity';
import { UserMapper } from './user-typeorm.mapper';

export class UserTokenMapper {
	static toDomain(aUserToken: TypeORMUserToken): DomainUserToken {
		return {
			id: aUserToken.id,
			user: aUserToken.user ? UserMapper.toDomain(aUserToken.user) : null,
			token: aUserToken.token,
			createdAt: aUserToken.createdAt,
			updatedAt: aUserToken.updatedAt,
			deletedAt: aUserToken.deletedAt || null,
		};
	}

	static toTypeORM(domainUserToken: DomainUserToken): TypeORMUserToken {
		const typeORMUserToken = new TypeORMUserToken();
		typeORMUserToken.id = domainUserToken.id;
		typeORMUserToken.user = domainUserToken.user
			? UserMapper.toTypeORM(domainUserToken.user)
			: null;
		typeORMUserToken.token = domainUserToken.token;
		typeORMUserToken.createdAt = domainUserToken.createdAt;
		typeORMUserToken.updatedAt = domainUserToken.updatedAt;
		typeORMUserToken.deletedAt = domainUserToken.deletedAt || null;

		return typeORMUserToken;
	}
}
