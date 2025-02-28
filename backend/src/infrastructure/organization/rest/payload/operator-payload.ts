// import { UserPayload } from 'src/infrastructure/user/rest/payload/user-payload';
// import { OrganizationPayload } from './organization-payload';
// import { User } from 'src/domain/user/model/user.entity';

export class OperatorPayload {
    id: string;

    user: any;

    organization: any;

    status: string;

    updatedAt: Date;

    createdAt: Date;
}
