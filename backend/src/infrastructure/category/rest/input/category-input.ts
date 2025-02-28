import { Category } from "src/domain/category/model/category.entity";

export class CategoryInput {
	id: string;
	name: string;
	father: Category;
	group: string;
	color: string;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: Date;
}
