import { MulterFile } from 'multer';
import { EventStatus } from '../model/event-status.enum';
import { Event } from '../model/event.entity';

export interface IEventRepository {
	findAll(): Promise<Event[]>;
	findById(id: string): Promise<Event>;
	findByName(name: string): Promise<Event[]>;
	findByUser(userId: string): Promise<Event[]>;
	findByUserAndStatus(userId: string, status: EventStatus): Promise<Event[]>;
	findByFilters(
		statuses: EventStatus[],
		organizations: string[]
	): Promise<Event[]>;
	findByVigents(organizations: string[]): Promise<Event[]>;
	create(event: Event, files: MulterFile[]): Promise<Event>;
	delete(id: string): Promise<Event>;
	update(event: Event, files: MulterFile[]): Promise<Event>;
	findByStatuses(statuses: EventStatus[]): Promise<Event[]>;
	findVigentByPlace(id_place: string): Promise<Event[]>;
	findByCategory(categoryId: string): Promise<Event[]>;
	findFirst15VigentEvents(lat: number, lng: number): Promise<Event[]>;
	findByCategories(categories: string[]): Promise<Event[]>;
	findVigents(): Promise<Event[]>;
	findEventsWithinOneDay(): Promise<any[]>;
}

export const IEventRepository = Symbol('IEventRepository');
