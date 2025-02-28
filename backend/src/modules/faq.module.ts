import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from 'src/infrastructure/faq/typeorm/model/faq.entity';
import { FaqController } from 'src/infrastructure/faq/rest/controller/faq.controller';
import { FindAllFaq } from 'src/domain/faq/case/findAllFaq.case';
import { IFaqRepository } from 'src/domain/faq/port/iFaqRepository';
import { FaqRepository } from 'src/infrastructure/faq/typeorm/repository/faq.repository';
import { NewFaq } from 'src/domain/faq/case/newFaq.case';

@Module({
    imports: [TypeOrmModule.forFeature([Faq])],
    controllers: [FaqController],
    providers: [
        FindAllFaq,
        {
            provide: IFaqRepository,
            useClass: FaqRepository,
        },
        NewFaq,
        {
            provide: IFaqRepository,
            useClass: FaqRepository
        }
    ],
})
export class FaqModule { }
