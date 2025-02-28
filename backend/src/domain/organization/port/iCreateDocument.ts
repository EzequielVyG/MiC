import { Organization } from '../model/organization.entity';
import { Document } from '../model/document.entity';

export interface iCreateDocument {
    create(
        name: string,
        url: string,
        organization: Organization
    ): Promise<Document>;
}
