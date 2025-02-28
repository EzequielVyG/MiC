import { Injectable, Inject } from '@nestjs/common';
import { IDocumentRepository } from '../port/IDocumentRepository';
import { iCreateDocument } from '../port/iCreateDocument';
import { Document } from 'src/domain/organization/model/document.entity';
import { Organization } from '../model/organization.entity';

require('dotenv').config();

@Injectable()
export class CreateDocument implements iCreateDocument {
    constructor(
        @Inject(IDocumentRepository)
        private documentRepository: IDocumentRepository,
    ) { }

    async create(
        name: string,
        url: string,
        organization: Organization
    ): Promise<Document> {
        try {
            const aDocument = new Document();
            aDocument.name = name
            aDocument.url = url
            aDocument.organization = organization

            const aDocumentEntity = await this.documentRepository.create(aDocument);

            return aDocumentEntity;
        } catch (error) {

        }

    }
}
