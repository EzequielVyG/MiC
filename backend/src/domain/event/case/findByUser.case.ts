import { Injectable, Inject } from '@nestjs/common';
import { IEventRepository } from '../port/iEventRepository';
import { Event } from '../model/event.entity';
import { IFindEventByUser } from '../port/iFindByUser';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { EventStatus } from '../model/event-status.enum';

@Injectable()
export class FindEventsByFilters implements IFindEventByUser {
	constructor(
		@Inject(IEventRepository)
		private readonly eventRepository: IEventRepository,
		@Inject(IUserRepository)
		private readonly userRepository: IUserRepository
	) { }

	async findByUser(mail: string): Promise<Event[]> {
		const user = await this.userRepository.findByEmail(mail);

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		return this.eventRepository.findByUser(user.id);
	}

	async findByUserAndVigente(mail: string): Promise<Event[]> {
		const user = await this.userRepository.findByEmail(mail);

		if (!user) {
			throw new Error('Usuario no encontrado');
		}

		return this.eventRepository.findByVigents([]);
	}

	async findByFilters(
		statuses: string[] | null = [],
		organizations: string[] | null = []
	): Promise<Event[]> {

		if (organizations.length === 0) {
			return []
		}
		const statusEnums: EventStatus[] = statuses.filter(
			(statusStr) => EventStatus[statusStr as keyof typeof EventStatus] !== undefined
		).map((statusStr) => EventStatus[statusStr as keyof typeof EventStatus]);

		let answer = [];
		// Ahora veo como filtrar los vigente
		if (statuses.includes('VIGENTS')) {
			answer = await this.eventRepository.findByVigents(
				organizations
			);
		}

		if (statusEnums.length !== 0) {
			const someEvents = await this.eventRepository.findByFilters(
				statusEnums,
				organizations
			);
			for (const event of someEvents) {
				if (!answer.find((e) => e.id === event.id)) answer.push(event);
			}
		}

		return answer;
	}
}
