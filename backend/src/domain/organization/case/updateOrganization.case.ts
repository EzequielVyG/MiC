import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
// import { IDocumentRepository } from '../port/IDocumentRepository';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
// import { CreateDocument } from './createDocument.case';

import { MulterFile } from 'multer';
import { Category } from 'src/domain/category/model/category.entity';
import { OrganizationUser } from 'src/domain/organization/model/organization-user.entity';
import { User } from 'src/domain/user/model/user.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { iUpdateOrganization } from '../port/iUpdateOrganization';
import { validateChangesByStatus } from './validation';
// import { IOperatorRepository } from '../port/iOperatorRepository';
const normalizeEmail = require('normalize-email');

@Injectable()
export class UpdateOrganization implements iUpdateOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository,
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
		// @Inject(IOperatorRepository)
		// private operatorRepository: IOperatorRepository,
	) { }

	async update(
		id: string,
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
		facebook_url:string,
		twitter_url:string,
		instagram_url:string, 
		email:string,
		web_organization_url:string, 
		description:string,
		status: string,
	): Promise<Organization> {
		const organizationSearched = await this.organizationRepository.findByID(id);
		if (!organizationSearched) {
			throw new Error('La organización no existe');
		}

		status = organizationSearched.status;
		validateChangesByStatus(
			organizationSearched,
			legalName,
			cuit,
			owner,
			supportingDocumentation
		);

		// organizationSearched.supportingDocumentation = supportingDocumentation;

		organizationSearched.legalName = legalName;
		organizationSearched.address = address;
		organizationSearched.cuit = cuit;
		organizationSearched.principalCategory = principalCategory;

		if (!categories.find((category) => category.id === principalCategory.id)) {
			categories.push(principalCategory);
		}

		organizationSearched.categories = categories;
		organizationSearched.cmi = cmi;
		organizationSearched.phone = phone;
		organizationSearched.owner = owner;
		organizationSearched.operators = []
		// TODO: Ver
		organizationSearched.legalName = legalName;
		organizationSearched.address = address;
		organizationSearched.cuit = cuit;
		organizationSearched.principalCategory = principalCategory
		organizationSearched.categories = categories;
		organizationSearched.cmi = cmi;
		organizationSearched.phone = phone;
		organizationSearched.owner = owner;
		organizationSearched.operators = [];
		organizationSearched.facebook_url=facebook_url;
		organizationSearched.twitter_url=twitter_url;
		organizationSearched.instagram_url=instagram_url;
		organizationSearched.email=email;
		organizationSearched.web_organization_url=web_organization_url;
		organizationSearched.description=description;
		// TODO: Ver

		const correosUnicos = {};

		operators = operators.filter((objeto) => {
			const email = normalizeEmail(objeto.user.email);
			const id = objeto.user.id;

			if (correosUnicos[email]) {
				return false;
			}

			correosUnicos[email] = true;

			if (id) {
				operators
					.filter((obj) => normalizeEmail(obj.user.email) === email && !obj.user.id)
					.forEach((obj) => correosUnicos[normalizeEmail(obj.user.email)] = true);
			}

			return true;
		});

		for (const aOperator of operators) {
			if (!aOperator.id) {
				const aOperatorEntity = await this.userRepository.findByEmail(normalizeEmail(aOperator.user.email));
				const newUser = new OrganizationUser();
				if (aOperatorEntity) {
					newUser.user = aOperatorEntity;
					newUser.organization = organizationSearched;
				} else {
					newUser.user = new User();
					newUser.user.email = aOperator.user.email;
					newUser.organization = organizationSearched;
					newUser.status = 'NOT_EXISTS'
				}
				organizationSearched.operators.push(newUser);
			} else {
				organizationSearched.operators.push(aOperator);
			}

		}

		organizationSearched.status = status;

		const organizationUpdated = await this.organizationRepository.update(
			organizationSearched,
			supportingDocumentation
		);

		return organizationUpdated;


	}
}
