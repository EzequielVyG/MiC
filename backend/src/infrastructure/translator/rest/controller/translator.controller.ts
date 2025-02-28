import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Event } from 'src/domain/event/model/event.entity';
import { Place } from 'src/domain/place/model/place.entity';
import { FindAllTranslator } from 'src/domain/translator/case/findAllTranslator.case';
import { FindByIdentificator } from 'src/domain/translator/case/findByIdentificator.case';
import { FindListEvent } from 'src/domain/translator/case/findListEvent.case';
import { FindListPlace } from 'src/domain/translator/case/findListPlace.case';
import { NewTranslator } from 'src/domain/translator/case/newTranslator.case';
import { UpdateTranslator } from 'src/domain/translator/case/updateTranslator.case';
import { Translator } from 'src/domain/translator/model/translator';
import { responseJson } from 'src/util/responseMessage';
import { TranslatorInput } from '../input/translator-input';
import { UpdateTranslatorInput } from '../input/update-translator-input';
import { TranslatorRestMapper } from '../mapper/translator-rest-mapper';
import { TranslatorPayload } from '../payload/translator-payload';

@Controller('translators')
export class TranslatorController {
    constructor(
        private readonly findAllTranslator: FindAllTranslator,
        private readonly findByIdentificator: FindByIdentificator,
        private readonly newTranslator: NewTranslator,
        private readonly updateTranslator: UpdateTranslator,
        private readonly translatorServicePlace: FindListPlace,
        private readonly translatorServiceEvent: FindListEvent
    ) { }

    @Get()
    async findAll(): Promise<TranslatorPayload[]> {
        try {
            const someTranslator: Translator[] = await this.findAllTranslator.findAll();
            return responseJson(
                200,
                'Traducciones recuperadas con exito',
                someTranslator.map((aTranslator) => {
                    return TranslatorRestMapper.toPayload(aTranslator);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post('/byPlaces')
    async findByPlaces(@Body() places: Place[]): Promise<TranslatorPayload[]> {
        try {
            const someTranslator: Translator[] = await this.translatorServicePlace.findListPlace(places);
            return responseJson(
                200,
                'Traductores encontrados por lugares',
                someTranslator.map((aTranslator) => {
                    return TranslatorRestMapper.toPayload(aTranslator);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post('/byEvents')
    async findByEvents(@Body() events: Event[]): Promise<TranslatorPayload[]> {
        try {
            const someTranslator: Translator[] = await this.translatorServiceEvent.findListEvent(events);
            return responseJson(
                200,
                'Traductores encontrados por eventos',
                someTranslator.map((aTranslator) => {
                    return TranslatorRestMapper.toPayload(aTranslator);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Get('/byEntity/:entityType/byIdentificator/:identificatorId')
    async findByidentificator(@Param('identificatorId') identificatorId: string, @Param('entityType') entityType: string): Promise<TranslatorPayload[]> {
        try {
            const someTranslator: Translator[] = await this.findByIdentificator.findByIdentificator(identificatorId, entityType);
            return responseJson(
                200,
                'Traducciones recuperadas con exito',
                someTranslator.map((aTranslator) => {
                    return TranslatorRestMapper.toPayload(aTranslator);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post()
    async create(@Body() translator: TranslatorInput): Promise<TranslatorPayload> {
        try {
            const aTranslator: Translator = await this.newTranslator.save(
                translator.entity,
                translator.identificador,
                translator.campo,
                translator.idioma,
                translator.traduccion
            );
            return responseJson(
                200,
                'Translator ingresado con exito',
                TranslatorRestMapper.toPayload(aTranslator)
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Put()
    async update(@Body() translator: UpdateTranslatorInput): Promise<TranslatorPayload> {
        try {
            const aTranslator: Translator = await this.updateTranslator.update(
                translator.id,
                translator.entity,
                translator.identificador,
                translator.campo,
                translator.idioma,
                translator.traduccion
            );
            return responseJson(
                200,
                'Translator ingresado con exito',
                TranslatorRestMapper.toPayload(aTranslator)
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }


}
