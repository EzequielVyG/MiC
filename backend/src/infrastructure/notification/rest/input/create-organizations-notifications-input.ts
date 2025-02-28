import { Organization } from 'src/domain/organization/model/organization.entity';

export class CreateOrganizationsNotificationsInput {
	title: string;
	description: string;
	link: string;
	organizations: Organization[];
}
