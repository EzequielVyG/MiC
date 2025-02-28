import { Controller, Get, Post, Body } from '@nestjs/common';
import { FindAllCategory } from '../../../../domain/category/case/findAllCategory.case';
import { FindCategoryByFather } from '../../../../domain/category/case/findCategoryByFather.case';
import { Category } from '../../../../domain/category/model/category.entity';
import { CategoryRestMapper } from '../mapper/category-rest-mapper';
import { CategoryPayload } from '../payload/category-payload';
import { responseJson } from 'src/util/responseMessage';
import { CategoryInput } from '../input/category-input';
import { FindPrincipalCategories } from 'src/domain/category/case/findPrincipalCategories.case';
import { FindAllEvent } from 'src/domain/category/case/findAllEvent.case';
import { FindAllNotEvent } from 'src/domain/category/case/findAllNotEvent';
import { FindAllCategoryWithPlaces } from 'src/domain/category/case/findAllCategoryWithPlaces.case';
import { FindAllCategoryWithVigentEvents } from 'src/domain/category/case/findAllCategoryWithVigentEvents.case';

@Controller('categories')
export class CategoryController {
	constructor(
		private readonly findAllCategory: FindAllCategory,
		private readonly findCategorybyFather: FindCategoryByFather,
		private readonly findPrincipalCategories: FindPrincipalCategories,
		private readonly findEventCategories: FindAllEvent,
		private readonly findNotEventCategories: FindAllNotEvent,
		private readonly findAllCategoryWithPlaces: FindAllCategoryWithPlaces,
		private readonly findAllCategoryWithVigentEvents: FindAllCategoryWithVigentEvents
	) {}

	@Get()
	async findAll(): Promise<CategoryPayload[]> {
		try {
			const someCategory: Category[] = await this.findAllCategory.findAll();
			return responseJson(
				200,
				'Categorias recuperadas con exito',
				someCategory.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('event')
	async findAllEvent(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findEventCategories.findAll();
			return responseJson(
				200,
				'Categorías de eventos recuperadas con exito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('withPlaces')
	async findAllWithPlaces(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findAllCategoryWithPlaces.findAll();
			return responseJson(
				200,
				'Categorías con places en la base de datos recuperadas con exito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('withVigentEvents')
	async findAllWithVigentEvents(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findAllCategoryWithVigentEvents.findAll();
			return responseJson(
				200,
				'Categorías con eventos vigentes en la base de datos recuperadas con exito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('notEvent')
	async findAllNotEvent(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findNotEventCategories.findAll();
			return responseJson(
				200,
				'Categorías no de eventos recuperadas con exito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('principalCategories')
	async findAllPrincipalCategories(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findPrincipalCategories.findAll();
			return responseJson(
				200,
				'Categorías principales recuperadas con éxito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/places/principalCategories')
	async findAllPlacesPrincipalCategories(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findPrincipalCategories.findAllPlaces();
			return responseJson(
				200,
				'Categorías principales recuperadas con éxito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/events/principalCategories')
	async findAllEventsPrincipalCategories(): Promise<CategoryPayload[]> {
		try {
			const someCategories: Category[] =
				await this.findPrincipalCategories.findAllEvents();
			return responseJson(
				200,
				'Categorías principales recuperadas con éxito',
				someCategories.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('father')
	async login(@Body() father: CategoryInput): Promise<CategoryPayload> {
		try {
			let aCategory: Category[];

			if (Object.keys(father).length === 0) {
				aCategory = await this.findCategorybyFather.findByFather(null);
			} else {
				aCategory = await this.findCategorybyFather.findByFather(father);
			}

			return responseJson(
				200,
				'Categorias recuperadas con exito',
				aCategory.map((aCategory) => {
					return CategoryRestMapper.toPayload(aCategory);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
