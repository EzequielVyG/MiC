import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';

import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { OrganizationUser } from 'src/domain/organization/model/organization-user.entity';
import { User } from 'src/domain/user/model/user.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { OrganizationStatus } from '../model/status.enum';
import { iCreateOrganization } from '../port/iCreateOrganization';
const normalizeEmail = require('normalize-email');

require('dotenv').config();

@Injectable()
export class CreateOrganization implements iCreateOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository,
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
	) { }

	async create(
		legalName: string,
		address: string,
		cuit: string,
		principalCategory: Category,
		categories: Category[],
		cmi: string,
		phone: string,
		owner: User,
		operators: any[],
		supportingDocumentation: MulterFile[],
		// documentDescription: string[]
		facebook_url:string,
		twitter_url:string,
		instagram_url:string, 
		email:string,
		web_organization_url:string, 
		description:string,
	): Promise<Organization> {
		const aOrganization = new Organization();
		aOrganization.legalName = legalName;
		aOrganization.address = address;
		aOrganization.cuit = cuit;
		aOrganization.principalCategory = principalCategory;

		if (!categories.find((category) => category.id === principalCategory.id)) {
			categories.push(principalCategory);
		}

		aOrganization.categories = categories;
		aOrganization.cmi = cmi;
		aOrganization.phone = phone;
		aOrganization.owner = owner;
		aOrganization.operators = [];
		aOrganization.facebook_url=facebook_url;
		aOrganization.twitter_url=twitter_url;
		aOrganization.instagram_url=instagram_url;
		aOrganization.email=email;
		aOrganization.web_organization_url=web_organization_url;
		aOrganization.description=description;

		const correosUnicos = {};

		operators = operators.filter((objeto) => {
			const email = objeto.user.email;

			if (correosUnicos[email]) {
				return false;
			}

			correosUnicos[email] = true;

			return true;
		});


		for (const aOperator of operators) {
			const aOperatorEntity = await this.userRepository.findByEmail(normalizeEmail(aOperator.user.email));
			const newUser = new OrganizationUser();
			if (aOperatorEntity) {
				newUser.user = aOperatorEntity;
			} else {
				newUser.user = new User();
				newUser.user.email = aOperator.user.email;
				newUser.status = 'NOT_EXISTS'
			}

			aOrganization.operators.push(newUser);
		}

		aOrganization.status = OrganizationStatus.PENDING;
		const aOrganizationEntity = await this.organizationRepository.create(
			aOrganization,
			supportingDocumentation
		);

		return aOrganizationEntity;
	}
}
