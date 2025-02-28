import { MulterFile } from 'multer'; // Import MulterFile type
import { Event } from 'src/domain/event/model/event.entity';
import { Role } from '../model/role.entity';
import { UserPreference } from '../model/user-preference.entity';
import { User } from '../model/user.entity';

export interface iUpdateUser {
	update(
		name: string,
		email: string,
		fechaNacimiento: string,
		avatar: MulterFile,
		favoriteEvents: Event[],
		preferences: UserPreference,
		roles: Role[],
	): Promise<User>;
}
