import { Organization } from '../model/organization.entity';
import { User } from 'src/domain/user/model/user.entity';

export interface iUpdateTakeOrganization {
    update(
        id: string,
        validator: User
    ): Promise<Organization>;
}