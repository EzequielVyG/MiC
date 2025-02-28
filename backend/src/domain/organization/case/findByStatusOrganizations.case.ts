import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IOrganizationRepository } from '../port/iOrganizationRepository';
import { IFindByStatusOrganizations } from '../port/iFindByStatusOrganizations';

@Injectable()
export class FindByStatusOrganization implements IFindByStatusOrganizations {
    constructor(
        @Inject(IOrganizationRepository)
        private readonly organizacionRepository: IOrganizationRepository
    ) { }

    findByStatus(someStatus: string[]): Promise<Organization[]> {
        return this.organizacionRepository.findByStatus(someStatus);

    }
}
