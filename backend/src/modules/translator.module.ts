import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindAllTranslator } from 'src/domain/translator/case/findAllTranslator.case';
import { FindByIdentificator } from 'src/domain/translator/case/findByIdentificator.case';
import { FindListEvent } from 'src/domain/translator/case/findListEvent.case';
import { FindListPlace } from 'src/domain/translator/case/findListPlace.case';
import { NewTranslator } from 'src/domain/translator/case/newTranslator.case';
import { UpdateTranslator } from 'src/domain/translator/case/updateTranslator.case';
import { ITranslatorRepository } from 'src/domain/translator/port/iTranslatorRepository';
import { TranslatorController } from 'src/infrastructure/translator/rest/controller/translator.controller';
import { Translator } from 'src/infrastructure/translator/typeorm/model/translator.entity';
import { TranslatorRepository } from 'src/infrastructure/translator/typeorm/repository/translator.repository';
@Module({
    imports: [TypeOrmModule.forFeature([Translator])],
    controllers: [TranslatorController],
    providers: [
        FindAllTranslator,
        FindByIdentificator,
        FindListPlace,
        FindListEvent,
        NewTranslator,
        UpdateTranslator,
        {
            provide: ITranslatorRepository,
            useClass: TranslatorRepository,
        },
    ],
})
export class TranslatorModule { }
