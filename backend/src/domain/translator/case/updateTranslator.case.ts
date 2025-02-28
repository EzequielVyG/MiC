import { Injectable, Inject } from '@nestjs/common';

require('dotenv').config();


import { ITranslatorRepository } from '../port/iTranslatorRepository';
import { Translator } from '../model/translator';
import { IUpdateTranslator } from '../port/iUpdateTranslator';
@Injectable()
export class UpdateTranslator implements IUpdateTranslator {
    constructor(
        @Inject(ITranslatorRepository)
        private translatorRepository: ITranslatorRepository
    ) { }

    async update(
        id: string,
        entity: string,
        identificador: string,
        campo: string,
        idioma: string,
        traduccion: string): Promise<Translator> {
        const aTranslator = new Translator();
        aTranslator.id = id;
        aTranslator.entity = entity;
        aTranslator.identificador = identificador;
        aTranslator.campo = campo;
        aTranslator.idioma = idioma;
        aTranslator.traduccion = traduccion;
        return this.translatorRepository.save(aTranslator);
    }
}
