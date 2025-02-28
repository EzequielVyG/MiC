import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindAccesibilities } from 'src/domain/accesibility/case/findAccesibilities.case';
import { IAccesibilityRepository } from 'src/domain/accesibility/port/iAccesibilityRepository';
import { AccesibilityController } from 'src/infrastructure/accesibility/rest/controller/accesibility.controller';
import { Accesibility } from 'src/infrastructure/accesibility/typeorm/model/accesibility.entity';
import { AccesibilityRepository } from 'src/infrastructure/accesibility/typeorm/repository/accesibility.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([Accesibility]),
	],
	controllers: [AccesibilityController],
	providers: [
		FindAccesibilities,
		{
			provide: IAccesibilityRepository,
			useClass: AccesibilityRepository,
		},
	],
})
export class AccesibilityModule {}
