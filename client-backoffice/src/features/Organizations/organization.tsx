import { Category } from '@/features/Categories/category';
import { User } from '@/features/Users/user';
import { Document } from './Document';
import { OrganizationOperator } from './OrganizationOperator';
export interface Organization {
	id?: string;
	legalName: string;
	address: string;
	cuit: string;
	principalCategory: Category;
	categories: Category[];
	cmi: string;
	phone: string;
	owner: User;
	operators: OrganizationOperator[];
	supportingDocumentation: Document[];
	facebook_url:string;
	twitter_url:string;
	instagram_url:string; 
	email:string;
	web_organization_url:string;
	description:string;
	status: string;
	validator: User;
}
