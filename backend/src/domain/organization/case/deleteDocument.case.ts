import { Injectable, Inject } from '@nestjs/common';
import { IDocumentRepository } from '../port/IDocumentRepository';
import { iDeleteDocument } from '../port/iDeleteDocument';

require('dotenv').config();

@Injectable()
export class DeleteDocument implements iDeleteDocument {
    constructor(
        @Inject(IDocumentRepository)
        private documentRepository: IDocumentRepository,
    ) { }

    async delete(id: string): Promise<string> {
        const aDocumentEntity = await this.documentRepository.delete(id);

        return aDocumentEntity;
    }
}
