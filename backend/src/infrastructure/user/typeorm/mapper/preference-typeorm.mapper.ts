import { UserPreference as TypeORMUserPreference } from '../model/user-preference.entity';
import { UserMapper } from './user-typeorm.mapper';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import { UserPreference as DomainUserPreference } from 'src/domain/user/model/user-preference.entity';

export class PreferenceMapper {
	static toDomain(preference: TypeORMUserPreference): DomainUserPreference {
		const aPreference = {
			id: preference.id,
			user: preference.user ? UserMapper.toDomain(preference.user) : null,
			initialContext: preference.initialContext,
			categories: preference.categories
				? preference.categories.map((category) =>
						CategoryMapper.toDomain(category)
				  )
				: [],
		};
		return aPreference;
	}

	static toTypeORM(
		domainPreference: DomainUserPreference
	): TypeORMUserPreference {
		const typeORMPreference = new TypeORMUserPreference();
		typeORMPreference.id = domainPreference.id;
		typeORMPreference.user = domainPreference.user
			? UserMapper.toTypeORM(domainPreference.user)
			: null;
		typeORMPreference.initialContext = domainPreference.initialContext;
		typeORMPreference.categories = domainPreference.categories
			? domainPreference.categories.map((category) =>
					CategoryMapper.toTypeORM(category)
			  )
			: [];

		return typeORMPreference;
	}
}
