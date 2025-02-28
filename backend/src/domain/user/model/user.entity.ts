import { UserAccount } from './userAccount.entity';
import { Role } from './role.entity';
import { Event } from 'src/domain/event/model/event.entity';
import { UserPreference } from './user-preference.entity';

export class User {
	id: string;

	name: string;

	fechaNacimiento: Date;

	password: string;

	email: string;

	status: string;

	avatar: string;

	roles: Role[];

	favoriteEvents: Event[];

	preferences: UserPreference;

	accounts: UserAccount[];

	createdAt: Date;

	updatedAt: Date;

	deletedAt: Date;
}
