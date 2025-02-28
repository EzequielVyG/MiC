import { Inject, Injectable } from '@nestjs/common';
import { User } from 'src/domain/user/model/user.entity';
import { Organization } from '../model/organization.entity';
import { OrganizationStatus } from '../model/status.enum';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { iUpdateTakeOrganization } from '../port/iUpdateTakeOrganization';

@Injectable()
export class UpdateTakeOrganization implements iUpdateTakeOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private organizationRepository: IOrganizationRepository
	) {}

	async update(id: string, validator: User): Promise<Organization> {
		const organizationSearched = await this.organizationRepository.findByID(id);

		if (!organizationSearched) {
			throw new Error('Organizacion inexistente');
		}
		organizationSearched.status = OrganizationStatus.IN_REVIEW;
		organizationSearched.validator = validator;

		const organizationUpdated = await this.organizationRepository.update(
			organizationSearched,
			null
		);
		return organizationUpdated;
	}
}
