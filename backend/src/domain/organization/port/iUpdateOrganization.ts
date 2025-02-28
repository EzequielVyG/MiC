import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { User } from 'src/domain/user/model/user.entity';
import { Organization } from '../model/organization.entity';

export interface iUpdateOrganization {
    update(
        id: string,
        legalName: string,
        address: string,
        cuit: string,
        principalCategory: Category,
        categories: Category[],
        cmi: string,
        phone: string,
        owner: User,
        operators: User[],
        supportingDocumentation: MulterFile[],
        facebook_url:string,
		twitter_url:string,
		instagram_url:string, 
		email:string,
		web_organization_url:string, 
		description:string,
        status: string,
    ): Promise<Organization>;
}