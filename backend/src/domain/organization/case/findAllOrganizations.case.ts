import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IfindAllOrganization } from '../port/iFindAllOrganization';
import { IOrganizationRepository } from '../port/iOrganizationRepository';

@Injectable()
export class FindAllOrganization implements IfindAllOrganization {
	constructor(
		@Inject(IOrganizationRepository)
		private readonly organizacionRepository: IOrganizationRepository
	) { }

	async findAll(): Promise<Organization[]> {
		return this.organizacionRepository.findAll();
	}

}
