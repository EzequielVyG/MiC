import { Inject, Injectable } from '@nestjs/common';
import { User } from '../model/user.entity';
import { IfindUsers } from '../port/iFindUsers';
import { IUserAccountRepository } from '../port/iUserAccountRepository';
import { IUserRepository } from '../port/iUserRepository';
import { Event } from 'src/domain/event/model/event.entity';
const normalizeEmail = require('normalize-email');

@Injectable()
export class FindUsers implements IfindUsers {
	constructor(
		@Inject(IUserRepository)
		private readonly userRepository: IUserRepository,
		@Inject(IUserAccountRepository)
		private userAccountRepository: IUserAccountRepository
	) {}

	async findByProvider(
		email: string,
		provider: string,
		accountID: string
	): Promise<User> {
		if (!provider) {
			throw new Error('No hay un provider definido');
		}

		if (accountID) {
			const user = await this.userRepository.findUserByLinkedAccountId(
				accountID,
				provider
			);
			const sortedEvents = this.sortEvents(user.favoriteEvents);
			user.favoriteEvents = sortedEvents;

			return user;
		}

		if (email) {
			const user = await this.userRepository.findUserByLinkedAccountEmail(
				email,
				provider
			);

			const sortedEvents = this.sortEvents(user.favoriteEvents);
			user.favoriteEvents = sortedEvents;

			return user;
		}
		throw new Error('No se pudo encontrar al usuario por el provider');
	}

	async findAll(): Promise<User[]> {
		return this.userRepository.findAll();
	}

	async findByEmail(email: string): Promise<User> {
		email = normalizeEmail(email);
		const user = await this.userRepository.findByEmail(email);

		const sortedEvents = this.sortEvents(user.favoriteEvents);
		user.favoriteEvents = sortedEvents;

		return user;
	}

	async findById(id: string): Promise<User> {
		const user = await this.userRepository.findByID(id);

		const sortedEvents = this.sortEvents(user.favoriteEvents);
		user.favoriteEvents = sortedEvents;

		return user;
	}

	sortEvents(events: Event[]) {
		events.sort((a, b) =>
			a.startDate > b.startDate ? 1 : b.startDate > a.startDate ? -1 : 0
		);
		return events;
	}
}
