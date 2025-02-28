import { Organization } from 'src/domain/organization/model/organization.entity';

export class CreateOrganizationNotificationsInput {
	title: string;
	description: string;
	link: string;
	organization: Organization;
}
