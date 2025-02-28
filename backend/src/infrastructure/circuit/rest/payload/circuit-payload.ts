import { Place } from "src/domain/place/model/place.entity";
import { CategoryPayload } from "src/infrastructure/category/rest/payload/category-payload";

export class CircuitPayload {
	id: string;
	name: string;
	description: string;
	places: Place[];
	principalCategory: CategoryPayload;
	categories: CategoryPayload[]
}
