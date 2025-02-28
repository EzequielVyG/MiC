import { Organization } from './organization.entity';

export class Document {
    id: string;

    name: string;

    url: string;

    description: string;

    organization: Organization;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}
