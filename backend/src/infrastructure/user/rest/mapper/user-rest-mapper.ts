// /infrastructure/user/rest/mapper/user-rest-mapper.ts
import { User } from '../../../../domain/user/model/user.entity';
import { UserPayload } from '../payload/user-payload';

export class UserRestMapper {
	static toPayload(user: User): UserPayload {
		return user
			? {
					id: user.id,
					name: user.name,
					fechaNacimiento: user.fechaNacimiento,
					roles: user.roles,
					email: user.email,
					status: user.status,
					preferences: user.preferences,
					favoriteEvents: user.favoriteEvents,
					accounts: user.accounts,
					avatar: user.avatar,
			  }
			: null;
	}
}
