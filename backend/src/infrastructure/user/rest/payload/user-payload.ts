import { Event } from 'src/domain/event/model/event.entity';
import { Role } from 'src/domain/user/model/role.entity';
import { UserPreference } from 'src/domain/user/model/user-preference.entity';
import { UserAccountPayload } from './account-payload';

export class UserPayload {
	id: string;
	name: string;
	fechaNacimiento: Date;
	roles: Role[];
	favoriteEvents: Event[];
	preferences: UserPreference;
	accounts: UserAccountPayload[];
	email: string;
	status: string;
	avatar: string;
}
