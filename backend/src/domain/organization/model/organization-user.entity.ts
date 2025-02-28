import { Organization } from './organization.entity';
import { User } from 'src/domain/user/model/user.entity';

export class OrganizationUser {
    id: string;

    organization: Organization

    user: User;

    status: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}