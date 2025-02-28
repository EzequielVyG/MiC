import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from 'src/domain/event/model/event.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { Translator as DomainTranslator } from 'src/domain/translator/model/translator';
import { ITranslatorRepository } from 'src/domain/translator/port/iTranslatorRepository';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { TranslatorMapper } from '../mapper/translator.typeorm.mapper';
import { Translator as TypeORMTranslator } from '../model/translator.entity';

@Injectable()
export class TranslatorRepository implements ITranslatorRepository {
    constructor(
        @InjectRepository(TypeORMTranslator)
        private readonly translatorRepository: Repository<TypeORMTranslator>
    ) { }

    async findAll(): Promise<DomainTranslator[]> {
        const translators = await this.translatorRepository.find();
        return translators.map(translator => TranslatorMapper.toDomain(translator));
    }

    async findByID(id: string): Promise<DomainTranslator> {
        const translator = await this.translatorRepository.findOne({ where: { id: id } });
        return translator ? TranslatorMapper.toDomain(translator) : null;
    }

    async findByIdentificator(identificatorId: string, entity: string): Promise<DomainTranslator[]> {
        const translators = await this.translatorRepository.find({ where: { identificador: identificatorId, entity: entity } });
        return translators.map(translator => TranslatorMapper.toDomain(translator));
    }

    async findListPlace(listPlace: Place[]): Promise<DomainTranslator[]> {
        // Crear una consulta personalizada con TypeORM
        const queryBuilder: SelectQueryBuilder<TypeORMTranslator> = this.translatorRepository.createQueryBuilder('translator');
        // Filtrar los traductores por los lugares especificados en la lista
        queryBuilder.where('translator.identificador IN (:...placeIds)', { placeIds: listPlace.map(place => place.id) });
        // Ejecutar la consulta
        const translators = await queryBuilder.getMany();

        return translators.map(translator => TranslatorMapper.toDomain(translator));
    }

    async findListEvent(listEvent: Event[]): Promise<DomainTranslator[]> {
        // Crear una consulta personalizada con TypeORM
        const queryBuilder: SelectQueryBuilder<TypeORMTranslator> = this.translatorRepository.createQueryBuilder('translator');
        // Filtrar los traductores por los lugares especificados en la lista
        queryBuilder.where('translator.identificador IN (:...eventIds)', { eventIds: listEvent.map(event => event.id) });
        // Ejecutar la consulta
        const translators = await queryBuilder.getMany();

        return translators.map(translator => TranslatorMapper.toDomain(translator));
    }

    async save(aTranslator: DomainTranslator): Promise<DomainTranslator> {
        const typeORMTranslator = TranslatorMapper.toTypeORM(aTranslator);
        const savedTranslator = await this.translatorRepository.save(typeORMTranslator);
        return TranslatorMapper.toDomain(savedTranslator);
    }

    async update(aTranslator: DomainTranslator): Promise<DomainTranslator> {
        const typeORMTranslator = TranslatorMapper.toTypeORM(aTranslator);
        const savedTranslator = await this.translatorRepository.save(typeORMTranslator);
        return TranslatorMapper.toDomain(savedTranslator);
    }
}
