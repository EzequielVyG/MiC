import { Injectable, Inject } from '@nestjs/common';
import { Translator } from '../model/translator';
import { ITranslatorRepository } from '../port/iTranslatorRepository';
import { IfindByIdentificator } from '../port/iFindByIdentificator';

@Injectable()
export class FindByIdentificator implements IfindByIdentificator {
    constructor(
        @Inject(ITranslatorRepository)
        private readonly translatorRepository: ITranslatorRepository
    ) { }
    async findByIdentificator(identificadorId: string, entity: string): Promise<Translator[]> {
        const translatorSearch = await this.translatorRepository.findByIdentificator(identificadorId, entity);
        return translatorSearch
    }
}
