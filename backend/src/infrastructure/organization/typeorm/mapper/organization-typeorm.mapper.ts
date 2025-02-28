import { OrganizationUser as DomainOrganizationOperator } from 'src/domain/organization/model/organization-user.entity';
import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import { UserMapper } from 'src/infrastructure/user/typeorm/mapper/user-typeorm.mapper';
import { Organization as DomainOrganization } from '../../../../domain/organization/model/organization.entity';
import { OrganizationUser as TypeORMOrganizationOperator } from '../model/organization-user.entity';
import { Organization as TypeORMOrganization } from '../model/organization.entity';
import { DocumentMapper } from './document-typeorm.mapper';
import { OrganizationOperatorMapper } from './organization-operator-typeorm.mapper';

export class OrganizationMapper {
	static toDomain(organization: TypeORMOrganization): DomainOrganization {
		try {
			return {
				id: organization.id,
				legalName: organization.legalName,
				address: organization.address,
				cuit: organization.cuit,
				principalCategory: organization.principalCategory
					? CategoryMapper.toDomain(organization.principalCategory)
					: null,
				categories: organization.categories
					? organization.categories.map((category) =>
						CategoryMapper.toDomain(category)
					)
					: [],
				cmi: organization.cmi,
				phone: organization.phone,
				owner: organization.owner
					? UserMapper.toDomain(organization.owner)
					: null,
				operators: organization.operators
					? organization.operators.map((operator) =>
						this.operatorToDomain(operator)
					)
					: [],
				supportingDocumentation: organization.supportingDocumentation
					? organization.supportingDocumentation.map((aDocumento) =>
						DocumentMapper.toDomain(aDocumento)
					)
					: [],
				status: organization.status,
				validator: organization.validator
					? UserMapper.toDomain(organization.validator)
					: null,
				facebook_url: organization.facebook_url,
				twitter_url: organization.twitter_url,
				instagram_url: organization.instagram_url,
				email: organization.email,
				web_organization_url: organization.web_organization_url,
				description: organization.description,
				createdAt: organization.createdAt,
				updatedAt: organization.updatedAt,
				deletedAt: organization.deletedAt || null,
			};
		} catch (error) {
			console.log("🚀 ~ file: organization-typeorm.mapper.ts:50 ~ OrganizationMapper ~ toDomain ~ error:", error)

		}

	}

	static toTypeORM(
		domainOrganization: DomainOrganization
	): TypeORMOrganization {
		const typeORMOrganization = new TypeORMOrganization();
		typeORMOrganization.id = domainOrganization.id;
		typeORMOrganization.legalName = domainOrganization.legalName;
		typeORMOrganization.address = domainOrganization.address;
		typeORMOrganization.cuit = domainOrganization.cuit;
		typeORMOrganization.principalCategory = domainOrganization.principalCategory
			? CategoryMapper.toTypeORM(domainOrganization.principalCategory)
			: null;
		typeORMOrganization.categories = domainOrganization.categories
			? domainOrganization.categories.map((category) =>
				CategoryMapper.toTypeORM(category)
			)
			: [];
		typeORMOrganization.cmi = domainOrganization.cmi;
		typeORMOrganization.phone = domainOrganization.phone;
		typeORMOrganization.owner = domainOrganization.owner
			? UserMapper.toTypeORM(domainOrganization.owner)
			: null;
		typeORMOrganization.operators = domainOrganization.operators.length > 0
			? domainOrganization.operators.map((operator) =>
				OrganizationOperatorMapper.toTypeORM(operator)
			)
			: [];
		typeORMOrganization.supportingDocumentation =
			domainOrganization.supportingDocumentation
				? domainOrganization.supportingDocumentation.map((aDocumento) =>
					DocumentMapper.toTypeORM(aDocumento)
				)
				: [];
		typeORMOrganization.status = domainOrganization.status;
		typeORMOrganization.validator = domainOrganization.validator
			? UserMapper.toTypeORM(domainOrganization.validator)
			: null;
		typeORMOrganization.facebook_url = domainOrganization.facebook_url;
		typeORMOrganization.twitter_url = domainOrganization.twitter_url;
		typeORMOrganization.instagram_url = domainOrganization.instagram_url;
		typeORMOrganization.email = domainOrganization.email;
		typeORMOrganization.web_organization_url = domainOrganization.web_organization_url;
		typeORMOrganization.description = domainOrganization.description;
		typeORMOrganization.createdAt = domainOrganization.createdAt;
		typeORMOrganization.updatedAt = domainOrganization.updatedAt;
		typeORMOrganization.deletedAt = domainOrganization.deletedAt || null;

		return typeORMOrganization;
	}


	private static operatorToDomain(
		operator: TypeORMOrganizationOperator
	): DomainOrganizationOperator {
		return {
			id: operator.id,
			user: operator.user ? UserMapper.toDomain(operator.user) : null,
			organization: operator.organization ? OrganizationMapper.toDomain(operator.organization) : null,
			status: operator.status,
			createdAt: operator.createdAt,
			updatedAt: operator.updatedAt,
			deletedAt: operator.deletedAt || null
		};
	}
}
