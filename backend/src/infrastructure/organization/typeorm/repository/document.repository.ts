import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Document as TypeORMDocument } from 'src/infrastructure/organization/typeorm/model/document.entity';
import { IDocumentRepository } from 'src/domain/organization/port/IDocumentRepository';
import { InjectRepository } from '@nestjs/typeorm';
import { Document as DomainDocument } from 'src/domain/organization/model/document.entity';
import { DocumentMapper } from '../mapper/document-typeorm.mapper';
import { Organization } from 'src/domain/organization/model/organization.entity';

@Injectable()
export class DocumentRepository implements IDocumentRepository {
	constructor(
		@InjectRepository(TypeORMDocument)
		private readonly documentRepository: Repository<TypeORMDocument>
	) {}

	async create(aDocument: DomainDocument): Promise<DomainDocument> {
		const typeORMDocument = DocumentMapper.toTypeORM(aDocument);
		const savedDocument = await this.documentRepository.save(typeORMDocument);
		return DocumentMapper.toDomain(savedDocument);
	}

	async delete(documentId: string): Promise<string> {
		const deleteResult = await this.documentRepository.delete(documentId);

		if (deleteResult.affected === 0) {
			throw new NotFoundException(`Document with ID ${documentId} not found`);
		}

		return `Document with ID ${documentId} deleted successfully`;
	}

	async findByOrganization(
		organization: Organization
	): Promise<DomainDocument[]> {
		const documents = await this.documentRepository.find({
			where: { organization: { id: organization.id } },
		});
		return documents.map((document) => DocumentMapper.toDomain(document));
	}
}
