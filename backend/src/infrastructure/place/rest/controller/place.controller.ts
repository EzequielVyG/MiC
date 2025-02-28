import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Query,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Place } from 'src/domain/place/model/place.entity';
import { responseJson } from 'src/util/responseMessage';
import { PlaceRestMapper } from '../mapper/place-rest-mapper';
import { PlacePayload } from '../payload/place-payload';

import { CreatePlace } from 'src/domain/place/case/createPlace.case';
import { DeletePlace } from 'src/domain/place/case/deletePlace.case';
import { FindPlaces } from 'src/domain/place/case/findPlaces.case';
import { UpdatePlace } from 'src/domain/place/case/updatePlace.case';
import { PlaceInput } from '../input/place-input';
import { UpdatePlaceInput } from '../input/update-place-input';

import { MulterFile } from 'multer';
import { CreatePhoto } from 'src/domain/place/case/createPhoto.case';
import { FindByCategories } from 'src/domain/place/case/findByCategories';
import { FindByCategory } from 'src/domain/place/case/findByCategory.case';
import { FindByDistance } from 'src/domain/place/case/findByDistance.case';
import { FindByOrganization } from 'src/domain/place/case/findByOrganization';
import { PlaceAndEventsPayload } from '../payload/place-event-payload';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('places')
export class PlaceController {
	constructor(
		private readonly findPlaces: FindPlaces,
		private readonly createPlace: CreatePlace,
		private readonly deletePlace: DeletePlace,
		private readonly updatePlace: UpdatePlace,
		private readonly createPhoto: CreatePhoto,
		private readonly findPlacesByDistance: FindByDistance,
		private readonly findPlacesByCategory: FindByCategory,
		private readonly findPlacesByOrganization: FindByOrganization,
		private readonly findPlacesByCategories: FindByCategories
	) { }

	@Get()
	async findAll(): Promise<PlacePayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlaces.findAll();
			return responseJson(
				200,
				'Espacios recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/findAllByDistance')
	async findAllByDistance(
		@Query('lat') lat: number,
		@Query('lng') lng: number
	): Promise<PlacePayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlaces.findAllByDistance(
				lat,
				lng
			);
			return responseJson(
				200,
				'Espacios filtrados por categoría recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toEventPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/withEvents')
	async findAllWithEvents(): Promise<PlaceAndEventsPayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlaces.findAllWithEvents();
			return responseJson(
				200,
				'Espacios con eventos recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toEventPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('id/:id')
	async findById(@Param('id') id: string): Promise<PlacePayload> {
		try {
			const aPlace: Place = await this.findPlaces.findById(id);
			return aPlace
				? responseJson(200, 'Espacio recuperado con exito', aPlace)
				: responseJson(500, 'No existe ese espacio');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byCategory/:categoryId')
	async findByCategory(
		@Param('categoryId') categoryId: string,
		@Query('lat') lat: number,
		@Query('lng') lng: number
	): Promise<PlacePayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlacesByCategory.findAll(
				categoryId,
				lat,
				lng
			);
			return responseJson(
				200,
				'Espacios filtrados por categoría recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toEventPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byCategories')
	async findByCategories(
		@Query('categories') categoryId: string[],
		@Query('lat') lat: number,
		@Query('lng') lng: number
	): Promise<PlacePayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlacesByCategories.findAll(
				categoryId,
				lat,
				lng
			);
			return responseJson(
				200,
				'Espacios filtrados por categoría recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toEventPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byOrganization/:organizationId')
	async findByOrganization(
		@Param('organizationId') organizationId: string
	): Promise<PlacePayload[]> {
		try {
			const somePlaces: Place[] = await this.findPlacesByOrganization.find(
				organizationId
			);
			return responseJson(
				200,
				'Espacios filtrados por organizacion recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('byDistance/:lat/:lng')
	async findByDistance(
		@Param('lat') lat: number,
		@Param('lng') lng: number
	): Promise<PlacePayload> {
		try {
			const punto = { lat: lat, lng: lng };
			const somePlaces: Place[] = await this.findPlacesByDistance.findAll(
				punto
			);
			return responseJson(
				200,
				'Espacios recuperados con exito',
				somePlaces.map((aPlace) => {
					return PlaceRestMapper.toPayload(aPlace);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	@UseInterceptors(FilesInterceptor('files'))
	async create(
		@Body() place: PlaceInput,
		@UploadedFiles() files: MulterFile[]
	): Promise<PlacePayload> {
		try {
			files = files ? files : [];
			for (const aFoto of files) {
				let extension = aFoto.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				aFoto.originalName = place.name + extension;
				aFoto.mimetype = 'image/jpg';
			}

			const aPlace: Place = await this.createPlace.create(
				place.name,
				place.description,
				place.note,
				place.schedules !== '' ? JSON.parse(place.schedules) : [],
				place.photos !== '' ? JSON.parse(place.photos) : [],
				place.principalCategory !== ''
					? JSON.parse(place.principalCategory)
					: null,
				place.categories !== '' ? JSON.parse(place.categories) : [],
				place.url,
				place.cmi,
				place.phone,
				place.domicile,
				place.location !== '' ? JSON.parse(place.location) : null,
				'WEB',
				place.minors,
				place.accessibilities !== '' ? JSON.parse(place.accessibilities) : [],
				place.services !== '' ? JSON.parse(place.services) : [],
				place.organization !== '' ? JSON.parse(place.organization) : null,
				files,
				place.facebook_url,
				place.twitter_url,
				place.instagram_url
			);

			return responseJson(
				200,
				'Espacio creado con exito',
				PlaceRestMapper.toPayload(aPlace)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Delete('/id/:id')
	async delete(@Param('id') id: string): Promise<PlacePayload> {
		try {
			const aPlace: Place = await this.deletePlace.delete(id);
			return aPlace
				? responseJson(
					200,
					`${aPlace.name} eliminado con exito`,
					PlaceRestMapper.toPayload(aPlace)
				)
				: responseJson(500, 'No existe un espacio con ese id');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	@UseInterceptors(FilesInterceptor('files'))
	async update(
		@Body() place: UpdatePlaceInput,
		@UploadedFiles() files: MulterFile[]
	): Promise<PlacePayload> {
		try {
			files = files ? files : [];
			for (const aFoto of files) {
				let extension = aFoto.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				aFoto.originalName = place.name + extension;
				aFoto.mimetype = 'image/jpg';
			}

			const aPlace = await this.updatePlace // Pasarle las categories también
				.update(
					place.id,
					place.name,
					place.description,
					place.note,
					place.schedules !== '' ? JSON.parse(place.schedules) : [],
					place.photos !== '' ? JSON.parse(place.photos) : [],
					place.principalCategory !== ''
						? JSON.parse(place.principalCategory)
						: null,
					place.categories !== '' ? JSON.parse(place.categories) : [],
					place.url,
					place.cmi,
					place.phone,
					place.domicile,
					place.location !== '' ? JSON.parse(place.location) : null,
					place.minors,
					place.accessibilities !== '' ? JSON.parse(place.accessibilities) : [],
					place.services !== '' ? JSON.parse(place.services) : [],
					place.organization !== '' ? JSON.parse(place.organization) : null,
					files,
					place.facebook_url,
					place.twitter_url,
					place.instagram_url
				);

			return aPlace
				? responseJson(
					200,
					'Espacio actualizado con exito',
					PlaceRestMapper.toPayload(aPlace)
				)
				: responseJson(500, 'El espacio no existe');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
