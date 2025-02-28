import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindServices } from 'src/domain/service/case/findServices.case';
import { IServiceRepository } from 'src/domain/service/port/iServiceRepository';
import { Service } from 'src/infrastructure/place/typeorm/model/service.entity';
import { ServiceController } from 'src/infrastructure/service/rest/controller/service.controller';
import { ServiceRepository } from 'src/infrastructure/service/typeorm/repository/service.repository';

@Module({
	imports: [
		TypeOrmModule.forFeature([Service]),
	],
	controllers: [ServiceController],
	providers: [
		FindServices,
		{
			provide: IServiceRepository,
			useClass: ServiceRepository,
		},
	],
})
export class ServiceModule {}
