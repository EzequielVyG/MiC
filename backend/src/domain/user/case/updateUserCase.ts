import { Inject, Injectable } from '@nestjs/common';
import { MulterFile } from 'multer'; // Import MulterFile type
import { User } from '../model/user.entity';
import { iUpdateUser } from '../port/iUpdateUser';
import { IUserRepository } from '../port/iUserRepository';
const normalizeEmail = require('normalize-email');

import { Event } from 'src/domain/event/model/event.entity';
import { MinioClientService } from 'src/minio-client/minio-client.service';
import { ContextEnum } from '../model/context.enum';
import { Role } from '../model/role.entity';
import { UserPreference } from '../model/user-preference.entity';
import { ImagesProcessorService } from 'src/util/images-processor.service';
const ImagesProcessor = new ImagesProcessorService();

@Injectable()
export class UpdateUser implements iUpdateUser {
	constructor(
		@Inject(IUserRepository)
		private userRepository: IUserRepository,
		private minioClientService: MinioClientService
	) { }

	async update(
		name: string,
		email: string,
		fechaNacimiento: string,
		avatar: MulterFile,
		favoriteEvents: Event[],
		preferences: UserPreference,
		roles: Role[],
	): Promise<User> {
		email = normalizeEmail(email);
		const userSearched = await this.userRepository.findByEmail(email);
		if (!userSearched) {
			throw new Error('Usuario inexistente');
		}

		if (preferences.initialContext) {
			if (!ContextEnum[preferences.initialContext]) {
				throw new Error('Contexto inválido');
			}
			preferences.initialContext = ContextEnum[preferences.initialContext];
			userSearched.preferences = preferences;
		}

		userSearched.email = email;
		userSearched.name = name.trim();

		if (avatar) {
			avatar = await ImagesProcessor.resizeSingleImage(avatar);
			const uri = await this.minioClientService.verifyBucket('avatar', avatar);
			userSearched.avatar = uri;
		}
		userSearched.fechaNacimiento = fechaNacimiento ? new Date(fechaNacimiento) : null

		if (userSearched.fechaNacimiento > new Date()) {
			throw new Error(
				'Fecha de nacimiento incorrecta, no puede ser mayor al día actual.'
			);
		}

		if (favoriteEvents) {
			userSearched.favoriteEvents = favoriteEvents;
		}

		if (roles && roles.length > 0) {
			userSearched.roles = roles;
		}
		const userUpdated = await this.userRepository.update(userSearched);
		return userUpdated;
	}
}
