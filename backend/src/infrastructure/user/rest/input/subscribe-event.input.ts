import { Category } from 'src/domain/category/model/category.entity';
import { Place } from 'src/domain/place/model/place.entity';

export class SubscribeToEventInput {
	event: {
		id: string;
		name: string;
		description: string;
		cmi: string;
		phone: string;
		minors: string;
		place: Place;
		principalCategory: Category;
		categories: string;
		startDate: string;
		endDate: string;
		price: string;
		photos: string;
		url: string;
		isDraft: boolean;
		participants: string;
	};
}
