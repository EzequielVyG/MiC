import { Place } from '../model/place.entity';

export interface IFindByOrganization {
    find(organizationId: string): Promise<Place[]>;
}
