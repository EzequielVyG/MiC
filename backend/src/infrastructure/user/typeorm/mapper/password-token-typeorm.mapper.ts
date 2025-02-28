import { PasswordToken as DomainPasswordToken } from 'src/domain/user/model/passwordToken.entity';
import { PasswordToken as TypeORMPasswordToken } from '../model/passwordToken.entity';
import { UserMapper } from './user-typeorm.mapper';

export class PasswordTokenMapper {
	static toDomain(aPasswordToken: TypeORMPasswordToken): DomainPasswordToken {
		return {
			id: aPasswordToken.id,
			user: aPasswordToken.user
				? UserMapper.toDomain(aPasswordToken.user)
				: null,
			token: aPasswordToken.token,
			status: aPasswordToken.status,
			createdAt: aPasswordToken.createdAt,
			updatedAt: aPasswordToken.updatedAt,
			deletedAt: aPasswordToken.deletedAt || null,
		};
	}

	static toTypeORM(
		domainPasswordToken: DomainPasswordToken
	): TypeORMPasswordToken {
		const typeORMPasswordToken = new TypeORMPasswordToken();
		typeORMPasswordToken.id = domainPasswordToken.id;
		typeORMPasswordToken.user = domainPasswordToken.user
			? UserMapper.toTypeORM(domainPasswordToken.user)
			: null;
		typeORMPasswordToken.token = domainPasswordToken.token;
		typeORMPasswordToken.status = domainPasswordToken.status;
		typeORMPasswordToken.createdAt = domainPasswordToken.createdAt;
		typeORMPasswordToken.updatedAt = domainPasswordToken.updatedAt;
		typeORMPasswordToken.deletedAt = domainPasswordToken.deletedAt || null;

		return typeORMPasswordToken;
	}
}
