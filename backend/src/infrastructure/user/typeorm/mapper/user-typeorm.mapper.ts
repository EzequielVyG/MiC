import { User as TypeORMUser } from '../model/user.entity';
import { User as DomainUser } from '../../../../domain/user/model/user.entity';
import { EventMapper } from 'src/infrastructure/event/typeorm/mapper/event-typeorm.mapper';
import { UserAccountMapper } from './user-account.typeorm.mapper';
import { PreferenceMapper } from './preference-typeorm.mapper';

export class UserMapper {
	static toDomain(user: TypeORMUser): DomainUser {
		const aUser = {
			id: user.id,
			name: user.name || null,
			fechaNacimiento: user.fechaNacimiento || null,
			password: user.password,
			email: user.email,
			status: user.status,
			avatar: user.avatar || null, // Aquí deberías mapear la propiedad avatar en caso de que necesites realizar alguna conversión especial
			roles: user.roles || [],
			favoriteEvents: user.favoriteEvents
				? user.favoriteEvents.map((event) => EventMapper.toDomain(event))
				: [],
			preferences: user.preferences
				? PreferenceMapper.toDomain(user.preferences)
				: null,
			accounts: user.accounts
				? user.accounts.map((account) => UserAccountMapper.toDomain(account))
				: [],
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
			deletedAt: user.deletedAt || null,
		};
		return aUser;
	}

	static toTypeORM(domainUser: DomainUser): TypeORMUser {
		const typeORMUser = new TypeORMUser();
		typeORMUser.id = domainUser.id;
		typeORMUser.name = domainUser?.name || null;
		typeORMUser.fechaNacimiento = domainUser.fechaNacimiento;
		typeORMUser.password = domainUser.password;
		typeORMUser.email = domainUser.email;
		typeORMUser.status = domainUser.status;
		typeORMUser.avatar = domainUser.avatar || null; // Aquí deberías mapear la propiedad avatar en caso de que necesites realizar alguna conversión especial
		typeORMUser.roles = domainUser.roles || null;
		typeORMUser.favoriteEvents = domainUser.favoriteEvents
			? domainUser.favoriteEvents.map((event) => EventMapper.toTypeORM(event))
			: [];
		typeORMUser.createdAt = domainUser.createdAt;
		typeORMUser.updatedAt = domainUser.updatedAt;
		typeORMUser.deletedAt = domainUser.deletedAt || null;

		typeORMUser.preferences = domainUser.preferences
			? PreferenceMapper.toTypeORM(domainUser.preferences)
			: null;
		typeORMUser.accounts = domainUser.accounts
			? domainUser.accounts.map((account) =>
					UserAccountMapper.toTypeORM(account)
			  )
			: [];
		return typeORMUser;
	}
}
