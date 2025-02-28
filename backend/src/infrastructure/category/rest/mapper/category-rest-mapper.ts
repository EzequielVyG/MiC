import { Category } from '../../../../domain/category/model/category.entity';
import { CategoryPayload } from '../payload/category-payload';

export class CategoryRestMapper {
	static toPayload(categoria: Category): CategoryPayload {
		return {
			id: categoria.id,
			name: categoria.name,
			father: categoria.father,
			group: categoria.group,
			color: categoria.color
		}
	}
}