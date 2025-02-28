import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PasswordToken as DomainPasswordToken } from 'src/domain/user/model/passwordToken.entity';
import { PasswordToken as TypeORMPasswordToken } from '../model/passwordToken.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { User as DomainUser } from 'src/domain/user/model/user.entity';
import { PasswordTokenMapper } from '../mapper/password-token-typeorm.mapper';
import { IPasswordTokenRepository } from 'src/domain/user/port/iPasswordTokenRepository';

@Injectable()
export class PasswordTokenRepository implements IPasswordTokenRepository {
	constructor(
		@InjectRepository(TypeORMPasswordToken)
		private readonly passwordTokenRepository: Repository<TypeORMPasswordToken>
	) { }

	async findByToken(aToken: string): Promise<DomainPasswordToken> {
		const aPasswordToken = await this.passwordTokenRepository.findOne({
			where: {
				token: aToken,
			},
			relations: ['user']
		});

		return aPasswordToken ? PasswordTokenMapper.toDomain(aPasswordToken) : null;
	}

	async findByUserAndStatus(
		user: DomainUser,
		status: string
	): Promise<DomainPasswordToken> {
		const aPasswordToken = await this.passwordTokenRepository.findOne({
			where: {
				user: { id: user.id },
				status: status,
			},
		});

		return aPasswordToken ? PasswordTokenMapper.toDomain(aPasswordToken) : null;
	}

	async create(
		aPasswordToken: DomainPasswordToken
	): Promise<DomainPasswordToken> {
		const TypeORMPasswordToken = PasswordTokenMapper.toTypeORM(aPasswordToken);
		const savedOrganization = await this.passwordTokenRepository.save(
			TypeORMPasswordToken
		);
		return PasswordTokenMapper.toDomain(savedOrganization);
	}

	async update(
		aPasswordToken: DomainPasswordToken
	): Promise<DomainPasswordToken> {
		const TypeORMPasswordToken = PasswordTokenMapper.toTypeORM(aPasswordToken);
		const updatedOrganization = await this.passwordTokenRepository.save(
			TypeORMPasswordToken
		);
		return PasswordTokenMapper.toDomain(updatedOrganization);
	}
}
