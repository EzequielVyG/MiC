import { Inject, Injectable } from '@nestjs/common';
import { OrganizationStatus } from '../model/status.enum';
import { iUpdateOperator } from '../port/iUpdateOperator';
import { IOperatorRepository } from '../port/iOperatorRepository';
import { OrganizationUser } from '../model/organization-user.entity';

@Injectable()
export class UpdateOperator implements iUpdateOperator {
    constructor(
        @Inject(IOperatorRepository)
        private operatorRepository: IOperatorRepository
    ) { }

    async updateStatus(id: string, status: string): Promise<OrganizationUser> {
        const operatorSearched = await this.operatorRepository.findByID(id);

        if (!operatorSearched) {
            throw new Error('Organizacion inexistente');
        }
        operatorSearched.status = OrganizationStatus.IN_REVIEW;
        operatorSearched.status = status;

        const organizationUpdated = await this.operatorRepository.update(
            operatorSearched);
        return organizationUpdated;
    }
}
