import { Inject, Injectable } from '@nestjs/common';
import { Place } from 'src/domain/place/model/place.entity';
import { Translator } from '../model/translator';
import { IfindListPlace } from '../port/iFindListPlace';
import { ITranslatorRepository } from '../port/iTranslatorRepository';
@Injectable()
export class FindListPlace implements IfindListPlace {
    constructor(
        @Inject(ITranslatorRepository)
        private readonly translatorRepository: ITranslatorRepository
    ) { }

    async findListPlace(listPlace:Place[]): Promise<Translator[]> {
        return this.translatorRepository.findListPlace(listPlace);
    }
}
