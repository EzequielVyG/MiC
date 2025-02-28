import { Injectable, Inject } from '@nestjs/common';

require('dotenv').config();


import { ITranslatorRepository } from '../port/iTranslatorRepository';
import { Translator } from '../model/translator';
import { INewTranslator } from '../port/iNewTranslator';

@Injectable()
export class NewTranslator implements INewTranslator {
    constructor(
        @Inject(ITranslatorRepository)
        private translatorRepository: ITranslatorRepository
    ) { }

    async save(
        entity: string,
        identificador: string,
        campo: string,
        idioma: string,
        traduccion: string): Promise<Translator> {
        const aTranslator = new Translator();
        aTranslator.entity = entity;
        aTranslator.identificador = identificador;
        aTranslator.campo = campo;
        aTranslator.idioma = idioma;
        aTranslator.traduccion = traduccion;
        return this.translatorRepository.save(aTranslator);
    }
}
