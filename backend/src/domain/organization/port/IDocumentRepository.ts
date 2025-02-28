import { Document } from '../model/document.entity';
import { Organization } from '../model/organization.entity';

export interface IDocumentRepository {
    findByOrganization(organization: Organization): Promise<Document[]>;
    create(aDocument: Document): Promise<Document>;
    delete(documentId: string): Promise<string>;
}

export const IDocumentRepository = Symbol('IDocumentRepository');
