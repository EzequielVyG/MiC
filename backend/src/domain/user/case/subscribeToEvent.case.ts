import { Injectable, Inject } from '@nestjs/common';
import { IUserRepository } from '../port/iUserRepository';

import { iSubscribeToEvent } from '../port/iSubscribeToEvent';
import { Event } from 'src/domain/event/model/event.entity';
import { SubscribeToEventInput } from 'src/infrastructure/user/rest/input/subscribe-event.input';

@Injectable()
export class SubscribeToEvent implements iSubscribeToEvent {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository
	) {}

	async subscribe(userEmail: string, body: SubscribeToEventInput) {
		const userSearched = await this.userRepository.findByEmail(userEmail);

		if (!userSearched) {
			throw new Error('Usuario inexistente');
		}

		if (
			userSearched.favoriteEvents.findIndex((e) => e.id === body.event.id) ===
			-1
		) {
			const aEvent = new Event();
			aEvent.id = body.event.id;
			userSearched.favoriteEvents.push(aEvent);
		}

		const updatedUser = await this.userRepository.update(userSearched);

		return updatedUser;
	}

	async unsubscribe(userEmail: string, body: SubscribeToEventInput) {
		const userSearched = await this.userRepository.findByEmail(userEmail);

		if (!userSearched) {
			throw new Error('Usuario inexistente');
		}
		const index = userSearched.favoriteEvents.findIndex(
			(e) => e.id === body.event.id
		);
		if (index !== -1) {
			userSearched.favoriteEvents.splice(index, 1);
		}

		const updatedUser = await this.userRepository.update(userSearched);

		return updatedUser;
	}
}
