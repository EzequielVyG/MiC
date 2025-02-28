import { Injectable, Inject } from '@nestjs/common';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { OrganizationStatus } from '../model/status.enum';
import { Organization } from '../model/organization.entity';
import { iDeleteOrganization } from '../port/iDeleteOrganization';

@Injectable()
export class DeleteOrganization implements iDeleteOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private readonly organizationRepository: IOrganizationRepository
	) {}

	async delete(id: string): Promise<Organization> {
		const aOrganizationSearched = await this.organizationRepository.findByID(
			id
		);
		aOrganizationSearched.status = OrganizationStatus.DELETED;
		return await this.organizationRepository.update(
			aOrganizationSearched,
			null
		);
	}
}
