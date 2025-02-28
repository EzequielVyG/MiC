import { Inject, Injectable } from '@nestjs/common';
import { Event } from 'src/domain/event/model/event.entity';
import { Translator } from '../model/translator';
import { IfindListEvent } from '../port/iFindListEvent';
import { ITranslatorRepository } from '../port/iTranslatorRepository';
@Injectable()
export class FindListEvent implements IfindListEvent {
    constructor(
        @Inject(ITranslatorRepository)
        private readonly translatorRepository: ITranslatorRepository
    ) { }

    async findListEvent(listEvent:Event[]): Promise<Translator[]> {
        return this.translatorRepository.findListEvent(listEvent);
    }
}
