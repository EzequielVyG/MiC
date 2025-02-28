import { Category } from 'src/infrastructure/category/typeorm/model/category.entity';
import { EventParticipant } from 'src/infrastructure/event/typeorm/model/event-participant.entity';
import { Organization } from 'src/infrastructure/organization/typeorm/model/organization.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Event } from '../../event/typeorm/model/event.entity';
import { Place } from '../../place/typeorm/model/place.entity';
import { User } from '../../user/typeorm/model/user.entity';
import data = require('./json/events.json');
import { EventFlyer } from 'src/infrastructure/event/typeorm/model/event-flyer.entity';

export default class EventsSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		console.log('Seeders Event...');
		const eventRepository = dataSource.getRepository(Event);
		const userRepository = dataSource.getRepository(User);
		const placeRepository = dataSource.getRepository(Place);
		const categoryRepository = dataSource.getRepository(Category);
		const organizationRepository = dataSource.getRepository(Organization);
		const participantRepository = dataSource.getRepository(EventParticipant);
		const eventFlyerRepository = dataSource.getRepository(EventFlyer);

		const eventToInsert: Event[] = await Promise.all(
			data.map(async (aEvent) => {
				const event = new Event();

				event.name = aEvent.name;
				event.description = aEvent.description;
				event.minors = aEvent.minors;
				const eventCreator = await userRepository.findOne({
					where: { email: aEvent.creator.email },
				});
				event.creator = eventCreator;

				const eventPlace = await placeRepository.findOne({
					where: { name: aEvent.place.name },
				});
				event.place = eventPlace;

				if (aEvent.principalCategory) {
					event.principalCategory = await categoryRepository.findOne({
						where: { name: aEvent.principalCategory },
					});
				}
				event.status = aEvent.status;

				event.startDate = new Date(aEvent.startDate);
				event.endDate = new Date(aEvent.endDate);

				event.price = aEvent.price;
				event.url = aEvent.url;
				event.origin = 'SEEDER';
				event.urlTicketera = "";

				return event;
			})
		);

		const events = eventRepository.create(eventToInsert);

		await eventRepository.save(events);

		for (const aEvent of data) {
			const event = await eventRepository.findOne({
				where: { name: aEvent.name },
			});
			const participants = await Promise.all(
				aEvent.participants.map(async (aParticipant) => {
					const participant = new EventParticipant();
					participant.event = event;
					participant.organization = await organizationRepository.findOne({
						where: { legalName: aParticipant.organization.legalName },
					});
					participant.role = aParticipant.role;
					participant.status = aParticipant.status;
					return participant;
				})
			);
			const eventParticipants = participantRepository.create(participants);
			await participantRepository.save(eventParticipants);

			const photos = await Promise.all(aEvent.flyers.map(async (aFlyer) => {
				const photo = new EventFlyer();
				photo.flyerUrl = aFlyer;
				photo.event = event;
				return photo
			}))

			const someEventFlyers = eventFlyerRepository.create(photos);
			await eventFlyerRepository.save(someEventFlyers);
		}
	}
}
