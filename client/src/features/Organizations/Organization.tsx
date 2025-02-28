import { Category } from '../Categories/category';
import { User } from '../Users/user';

export interface Organization {
	id: string;

	legalName: string;

	address: string;

	cuit: string;

	principalCategory: Category[];

	categories: Category[];

	cmi: string;

	phone: string;

	owner: User;

	operators: User[];

	supportingDocumentation: Document[];

	facebook_url:string;
	
	twitter_url:string;
	
	instagram_url:string; 
	
	email:string;
	
	web_organization_url:string;
	
	description:string;

	status: string;

	validator: User;

	createdAt?: Date;

	updatedAt?: Date;

	deletedAt?: Date;
}
