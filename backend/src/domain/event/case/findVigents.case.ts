import { Inject, Injectable } from '@nestjs/common';
import { Event } from '../model/event.entity';
import { IEventRepository } from '../port/iEventRepository';
import { IFindVigents } from '../port/iFindVigents';

@Injectable()
export class FindVigents implements IFindVigents {
	constructor(
		@Inject(IEventRepository)
		private readonly eventRepository: IEventRepository
	) {}

	async findAll(): Promise<Event[]> {
		const aEvent = this.eventRepository.findVigents();
		if (!aEvent) {
			throw new Error('Los eventos a buscar no existe');
		}

		return aEvent;
	}
}
