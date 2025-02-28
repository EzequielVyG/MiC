import { Injectable, Inject } from '@nestjs/common';
import { Translator } from '../model/translator';
import { ITranslatorRepository } from '../port/iTranslatorRepository';
import { IfindAllTranslator } from '../port/iFindAllTranslator';
@Injectable()
export class FindAllTranslator implements IfindAllTranslator {
    constructor(
        @Inject(ITranslatorRepository)
        private readonly translatorRepository: ITranslatorRepository
    ) { }

    async findAll(): Promise<Translator[]> {
        return this.translatorRepository.findAll();
    }
}
