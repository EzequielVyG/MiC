import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlacePhoto as DomainPlacePhoto } from 'src/domain/place/model/place-photo.entity';
import { Place as DomainPlace } from 'src/domain/place/model/place.entity';
import { Repository } from 'typeorm';
import { PhotoMapper } from '../mapper/photo-typeorm.mapper';
import { PlacePhoto as TypeORMPlacePhoto } from '../model/place-photo.entity';
import { IPhotoRepository } from 'src/domain/place/port/iPhotoRepository';

@Injectable()
export class PhotoRepository implements IPhotoRepository {
	constructor(
		@InjectRepository(TypeORMPlacePhoto)
		private readonly photoRepository: Repository<TypeORMPlacePhoto>
	) {}

	async create(
		aPhoto: DomainPlacePhoto,
		aPlace: DomainPlace
	): Promise<DomainPlacePhoto> {
		// aPlace.photos = null
		const typeORMPhoto = PhotoMapper.toTypeORM(aPhoto, aPlace);
		const savedPhoto = await this.photoRepository.save(typeORMPhoto);
		return PhotoMapper.toDomain(savedPhoto);
	}

	/* async delete(documentId: string): Promise<string> {
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
			where: { organization: organization },
		});
		return documents.map((document) => DocumentMapper.toDomain(document));
	} */
}
