import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { iUpdateStatusOrganization } from '../port/iUpdateStatusOrganization';

import { EmailService } from '../../../util/email.service';
import { OrganizationStatus } from '../model/status.enum';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
const Email = new EmailService();

@Injectable()
export class UpdateStatusOrganization implements iUpdateStatusOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository,
		private readonly createNotification: CreateNotification
	) {}

	async update(
		id: string,
		status: string,
		body: string
	): Promise<Organization> {
		const organizationSearched = await this.organizationRepository.findByID(id);

		if (!organizationSearched) {
			throw new Error('Organizacion inexistente');
		}
		organizationSearched.status = status;

		const organizationUpdated = await this.organizationRepository.update(
			organizationSearched,
			null
		);

		if (status !== OrganizationStatus.ON_HOLD) {
			if ((OrganizationStatus.ACTIVE === status || OrganizationStatus.REJECTED === status) && body){
				const title = "Actualizacíon de estado";
				const description = body;
				const link = null;
				await this.createNotification.createByOrganization(title, description, link, organizationSearched);

			await Email.sendInfo(organizationSearched.owner.email, body);
			}
		}

		return organizationUpdated;
	}
}
