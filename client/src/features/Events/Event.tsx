import { Category } from '../Categories/category';
import { Place } from '../Places/place';
import { User } from '../Users/user';
import { EventFlyer } from './EventFlyer';
import { EventParticipantes } from './EventParticipantes';
import { EventPhoto } from './EventPhoto';

export interface Event {
	id: string;
	name: string;
	description: string;
	minors: string;
	place: Place;
	principalCategory: Category;
	categories: Category[];
	creator: User;
	startDate: Date;
	endDate: Date;
	price: string;
	photos: EventPhoto[];
	flyers: EventFlyer[];
	url: string;
	urlTicketera: string;
	status: string;
	origin: string;
	participants: EventParticipantes[];
}
