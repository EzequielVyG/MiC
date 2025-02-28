import { OrganizationStatus } from 'src/domain/organization/model/status.enum';
import { CategoryRestMapper } from 'src/infrastructure/category/rest/mapper/category-rest-mapper';
// import { UserRestMapper } from 'src/infrastructure/user/rest/mapper/user-rest-mapper';
import { Organization } from '../../../../domain/organization/model/organization.entity';
import { OrganizationPayload } from '../payload/organization-payload';

const statusMap: { [key in OrganizationStatus]: string } = {
	[OrganizationStatus.PENDING]: 'Pendiente',
	[OrganizationStatus.ACTIVE]: 'Activo',
	[OrganizationStatus.REJECTED]: 'Rechazado',
	[OrganizationStatus.IN_REVIEW]: 'En revisión',
	[OrganizationStatus.ON_HOLD]: 'En espera',
	[OrganizationStatus.CANCELLED]: 'Cancelado',
	[OrganizationStatus.DELETED]: 'Eliminado',
};

export class OrganizationRestMapper {
	static toPayload(org: Organization): OrganizationPayload {
		return {
			id: org.id,
			legalName: org.legalName,
			address: org.address,
			cuit: org.cuit,
			principalCategory: org.principalCategory ? CategoryRestMapper.toPayload(org.principalCategory) : null,
			categories: org.categories
				? org.categories.map((category) =>
					CategoryRestMapper.toPayload(category)
				)
				: [],
			cmi: org.cmi,
			phone: org.phone,
			owner: org.owner,
			operators: org.operators
				? org.operators
				: [],
			supportingDocumentation: org.supportingDocumentation,
			status: statusMap[org.status as OrganizationStatus],
			facebook_url: org.facebook_url,
			twitter_url: org.twitter_url,
			instagram_url: org.instagram_url,
			email: org.email,
			web_organization_url: org.web_organization_url,
			description: org.description,
			validator: org.validator,
			updatedAt: org.updatedAt,
			createdAt: org.createdAt,
		};
	}
}
