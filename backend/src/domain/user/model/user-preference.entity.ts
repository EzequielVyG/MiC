import { Category } from 'src/domain/category/model/category.entity';
import { User } from './user.entity';

export class UserPreference {
	id: string;
	user: User;
	categories: Category[];
	initialContext: string; // Places, Events (o Circuits?)
}
