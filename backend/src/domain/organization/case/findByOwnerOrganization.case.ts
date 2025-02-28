import { Inject, Injectable } from '@nestjs/common';
import { Organization } from '../model/organization.entity';
import { IfindByOwnerOrganization } from '../port/iFindByOwnerOrganization';
import { IOrganizationRepository } from '../port/iOrganizationRepository';

@Injectable()
export class FindByOwnerOrganization implements IfindByOwnerOrganization {
    constructor(
        @Inject(IOrganizationRepository)
        private readonly organizacionRepository: IOrganizationRepository
    ) { }

    async findByOwner(ownerId: string): Promise<Organization[]> {
        return this.organizacionRepository.findByOwner(ownerId);
    }
}
