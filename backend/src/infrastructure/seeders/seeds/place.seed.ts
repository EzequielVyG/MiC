import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { Organization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { Accessibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';
import { DayOfWeek } from 'src/infrastructure/place/typeorm/model/day-of-week.entity';
import { PlacePhoto } from 'src/infrastructure/place/typeorm/model/place-photo.entity';
import { PlaceSchedule } from 'src/infrastructure/place/typeorm/model/place-schedule.entity';
import { Service } from 'src/infrastructure/place/typeorm/model/service.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Place } from '../../place/typeorm/model/place.entity';
import data = require('./json/places.json');

export default class PlaceSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		console.log('Seeders Places...');
		const placeRepository = dataSource.getRepository(Place);
		const scheduleRepository = dataSource.getRepository(PlaceSchedule);
		const daysOfWeekRepository = dataSource.getRepository(DayOfWeek);
		const categoryRepository = dataSource.getRepository(Category);
		const accessibilityRepository = dataSource.getRepository(Accessibility);
		const serviceRepository = dataSource.getRepository(Service);
		const organizationRepository = dataSource.getRepository(Organization);
		const placePhotosRepository = dataSource.getRepository(PlacePhoto);

		const placesToInsert: Place[] = await Promise.all(
			data.map(async (aPlace) => {
				const place = new Place(); // Crear una instancia de User
				place.name = aPlace.name;
				place.url = aPlace.url;
				place.instagram_url = aPlace.instagram_url;
				place.twitter_url = aPlace.twitter_url;
				place.facebook_url = aPlace.facebook_url;
				place.description = aPlace.description;
				place.domicile = aPlace.domicile;
				place.cmi = aPlace.cmi;
				place.phone = aPlace.phone;
				place.note = aPlace.note;
				place.origin = 'SEEDER';
				if (aPlace.principalCategory) {
					place.principalCategory = await categoryRepository.findOne({
						where: { name: aPlace.principalCategory },
					});
				}
				place.categories = await Promise.all(
					aPlace.categories.map(async (aPlace: any) => {
						return await categoryRepository.findOne({
							where: { name: aPlace },
						});
					})
				);

				place.location = {
					type: 'Point',
					coordinates: [aPlace.location.lng, aPlace.location.lat],
				};
				place.schedules = await Promise.all(
					aPlace.schedules.map(async (aSchedule) => {
						const schedule = new PlaceSchedule();
						schedule.closingHour = aSchedule.closingHour;
						schedule.openingHour = aSchedule.openingHour;
						schedule.dayOfWeek = await daysOfWeekRepository.findOne({
							where: { name: aSchedule.dayOfWeek.name },
						});
						return schedule;
					})
				);
				place.accessibilities = await Promise.all(
					aPlace.accessibilities.map(async (aAccessibility: any) => {
						return await accessibilityRepository.findOne({
							where: { name: aAccessibility.name },
						});
					})
				);
				place.services = await Promise.all(
					aPlace.services.map(async (aService: any) => {
						return await serviceRepository.findOne({
							where: { name: aService.name },
						});
					})
				);
				place.organization = aPlace.organization
					? await organizationRepository.findOne({
						where: { legalName: aPlace.organization.legalName },
					})
					: null;
				place.minors = aPlace.minors;

				return place;
			})
		);
		const places = placeRepository.create(placesToInsert);

		await placeRepository.save(places);

		// for (const aPlace of data) {
		// 	const place = await placeRepository.findOne({
		// 		where: { name: aPlace.name },
		// 	});

		// 	const categories = await Promise.all(
		// 		aPlace.categories.map(async (aCategory) => {
		// 			const category = new PlaceCategory();
		// 			category.category = await categoryRepository.findOne({
		// 				where: { name: aCategory },
		// 			});
		// 			category.place = place; // Asignar el lugar ya guardado
		// 			return category;
		// 		})
		// 	);

		// 	const placesCategories = placeCategoryRepository.create(categories);
		// 	await placeCategoryRepository.save(placesCategories);
		// }

		for (const aPlace of data) {
			const place = await placeRepository.findOne({
				where: { name: aPlace.name },
			});

			const schedules = await Promise.all(
				aPlace.schedules.map(async (aSchedule) => {
					const schedule = new PlaceSchedule();
					schedule.closingHour = aSchedule.closingHour;
					schedule.openingHour = aSchedule.openingHour;
					schedule.dayOfWeek = await daysOfWeekRepository.findOne({
						where: { name: aSchedule.dayOfWeek.name },
					});
					schedule.place = place; // Asignar el lugar ya guardado
					return schedule;
				})
			);

			const placesSchedules = scheduleRepository.create(schedules);
			await scheduleRepository.save(placesSchedules);

			const photos = await Promise.all(aPlace.photos.map(async (aPhoto) => {
				const photo = new PlacePhoto();
				photo.photoUrl = aPhoto
				photo.place = place
				return photo
			}))

			const placesPhotos = placePhotosRepository.create(photos);
			await placePhotosRepository.save(placesPhotos);
		}
	}
}
