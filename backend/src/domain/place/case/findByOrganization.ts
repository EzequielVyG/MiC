import { Injectable, Inject } from '@nestjs/common';
import { IPlaceRepository } from '../port/iPlaceRepository';
import { Place } from '../model/place.entity';
import { IFindByOrganization } from '../port/iFindByOrganization';
import { IOrganizationRepository } from 'src/domain/organization/port/iOrganizationRepository';

@Injectable()
export class FindByOrganization implements IFindByOrganization {
    constructor(
        @Inject(IPlaceRepository)
        private readonly placeRepository: IPlaceRepository,
        @Inject(IOrganizationRepository)
        private readonly organizationRepository: IOrganizationRepository
    ) { }

    async find(id: string): Promise<Place[]> {
        const aOrganization = await this.organizationRepository.findByID(id);

        if (!aOrganization) {
            throw new Error("Organizacion inexistente")
        }

        return this.placeRepository.findByOrganization(aOrganization);
    }
}
