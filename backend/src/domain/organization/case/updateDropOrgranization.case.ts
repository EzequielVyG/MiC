import { Injectable, Inject } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { iUpdateDropOrganization } from '../port/iUpdateDropOrganization';
import { OrganizationStatus } from '../model/status.enum';

@Injectable()
export class UpdateDropOrganization implements iUpdateDropOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository
	) {}

	async update(id: string): Promise<Organization> {
		const organizationSearched = await this.organizationRepository.findByID(id);

		if (!organizationSearched) {
			throw new Error('Organizacion inexistente');
		}
		organizationSearched.status = OrganizationStatus.PENDING;
		organizationSearched.validator = null;

		const organizationUpdated = await this.organizationRepository.update(
			organizationSearched,
			null
		);
		return organizationUpdated;
	}
}
