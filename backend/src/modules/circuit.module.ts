import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ICategoryRepository } from 'src/domain/category/port/iCategoryRepository';
import { CreateCircuit } from 'src/domain/circuit/case/createCircuit.case';
import { DeleteCircuit } from 'src/domain/circuit/case/deleteCircuit.case';
import { FindCircuits } from 'src/domain/circuit/case/finByCircuits.case';
import { FindByCategory } from 'src/domain/circuit/case/findByCategory.case';
import { UpdateCircuit } from 'src/domain/circuit/case/updateCircuit.case';
import { ICircuitRepository } from 'src/domain/circuit/port/iCircuitRepository';
import { IPhotoRepository } from 'src/domain/place/port/iPhotoRepository';
import { IPlaceRepository } from 'src/domain/place/port/iPlaceRepository';
import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { CategoryRepository } from 'src/infrastructure/category/typeorm/repository/category.repository';
import { CircuitController } from 'src/infrastructure/circuit/rest/controller/circuit.controller';
import { Circuit } from 'src/infrastructure/circuit/typeorm/model/circuit.entity';
import { CircuitRepository } from 'src/infrastructure/circuit/typeorm/repository/circuit.repository';
import { Accessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { DayOfWeek } from 'src/infrastructure/place/typeorm/model/day-of-week.entity';
import { PlacePhoto } from 'src/infrastructure/place/typeorm/model/place-photo.entity';
import { PlaceSchedule } from 'src/infrastructure/place/typeorm/model/place-schedule.entity';
import { Place } from 'src/infrastructure/place/typeorm/model/place.entity';
import { Service } from 'src/infrastructure/place/typeorm/model/service.entity';
import { PhotoRepository } from 'src/infrastructure/place/typeorm/repository/photo.repository';
import { PlaceRepository } from 'src/infrastructure/place/typeorm/repository/place.repository';

import { MinioClientModule } from 'src/minio-client/minio-client.module';

@Module({
	imports: [
		TypeOrmModule.forFeature([Circuit]),
		TypeOrmModule.forFeature([Place]),
		TypeOrmModule.forFeature([Category]),
		TypeOrmModule.forFeature([PlaceSchedule]),
		TypeOrmModule.forFeature([DayOfWeek]),
		TypeOrmModule.forFeature([PlacePhoto]),
		TypeOrmModule.forFeature([Accessibility]),
		TypeOrmModule.forFeature([Service]),
		MinioClientModule
	],
	controllers: [CircuitController],
	providers: [
		FindCircuits,
		CreateCircuit,
		DeleteCircuit,
		UpdateCircuit,
		FindByCategory,
		{
			provide: ICircuitRepository,
			useClass: CircuitRepository,
		},
		{
			provide: IPlaceRepository,
			useClass: PlaceRepository,
		},
		{
			provide: ICategoryRepository,
			useClass: CategoryRepository,
		},
		{
			provide: IPhotoRepository,
			useClass: PhotoRepository,
		},
	],
})
export class CircuitModule { }
