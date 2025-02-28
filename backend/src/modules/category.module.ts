import { Module } from '@nestjs/common';
import { CategoryController } from '../infrastructure/category/rest/controller/category.controller';
import { FindAllCategory } from '../domain/category/case/findAllCategory.case';
import { FindCategoryByFather } from '../domain/category/case/findCategoryByFather.case';
import { ICategoryRepository } from '../domain/category/port/iCategoryRepository';
import { CategoryRepository } from '../infrastructure/category/typeorm/repository/category.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../infrastructure/category/typeorm/model/category.entity';
import { FindPrincipalCategories } from 'src/domain/category/case/findPrincipalCategories.case';
import { FindAllEvent } from 'src/domain/category/case/findAllEvent.case';
import { FindAllNotEvent } from 'src/domain/category/case/findAllNotEvent';
import { FindAllCategoryWithPlaces } from 'src/domain/category/case/findAllCategoryWithPlaces.case';
import { FindAllCategoryWithVigentEvents } from 'src/domain/category/case/findAllCategoryWithVigentEvents.case';

@Module({
	imports: [TypeOrmModule.forFeature([Category])],
	controllers: [CategoryController],
	providers: [
		FindAllCategory,
		FindCategoryByFather,
		FindPrincipalCategories,
		FindAllEvent,
		FindAllNotEvent,
		FindAllCategoryWithPlaces,
		FindAllCategoryWithVigentEvents,
		{
			provide: ICategoryRepository,
			useClass: CategoryRepository,
		},
	],
})
export class CategoryModule {}
