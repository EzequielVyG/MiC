import { Document as TypeORMDocument } from '../model/document.entity';
import { Document as DomainDocument } from '../../../../domain/organization/model/document.entity';
import { OrganizationMapper } from './organization-typeorm.mapper';

export class DocumentMapper {
    static toDomain(document: TypeORMDocument): DomainDocument {
        return {
            id: document.id,
            name: document.name,
            url: document.url,
            description: document.description,
            organization: document.organization ? OrganizationMapper.toDomain(document.organization) : null,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
            deletedAt: document.deletedAt || null,
        };
    }

    static toTypeORM(domainDocument: DomainDocument): TypeORMDocument {
        const typeORMDocument = new TypeORMDocument();
        typeORMDocument.id = domainDocument.id;
        typeORMDocument.name = domainDocument.name;
        typeORMDocument.url = domainDocument.url;
        typeORMDocument.description = domainDocument.description;
        typeORMDocument.organization = domainDocument.organization ? OrganizationMapper.toTypeORM(domainDocument.organization) : null
        typeORMDocument.createdAt = domainDocument.createdAt;
        typeORMDocument.updatedAt = domainDocument.updatedAt;
        typeORMDocument.deletedAt = domainDocument.deletedAt || null;
        return typeORMDocument;
    }
}
