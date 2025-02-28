import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserToken as DomainUserToken } from 'src/domain/user/model/userToken.entity';
import { UserToken as TypeORMUserToken } from '../model/userToken.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../model/user.entity';
import { UserTokenMapper } from '../mapper/user-token-typeorm.mapper';
import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';
import { User as DomainUser } from 'src/domain/user/model/user.entity';
import { UserMapper } from '../mapper/user-typeorm.mapper';

@Injectable()
export class UserTokenRepository implements IUserTokenRepository {
	constructor(
		@InjectRepository(TypeORMUserToken)
		private readonly userTokenRepository: Repository<TypeORMUserToken>
	) {}

	async findByUser(aUser: DomainUser): Promise<DomainUserToken[]> {
		const typeORMUser = UserMapper.toTypeORM(aUser);
		const aUserToken = await this.userTokenRepository.find({
			where: {
				user: { id: typeORMUser.id },
			},
		});
		return aUserToken
			? aUserToken.map((user) => UserTokenMapper.toDomain(user))
			: null;
	}

	async create(userToken: DomainUserToken): Promise<DomainUserToken> {
		const TypeORMUserToken = UserTokenMapper.toTypeORM(userToken);
		const savedUserToken = await this.userTokenRepository.save(
			TypeORMUserToken
		);
		return UserTokenMapper.toDomain(savedUserToken);
	}

	async deleteToken(userToken: DomainUserToken): Promise<DomainUserToken> {
		const TypeORMUserToken = UserTokenMapper.toTypeORM(userToken);
		const aUserToken = await this.findByUserAndToken(
			TypeORMUserToken.user,
			userToken.token
		);
		const deletedUserToken = aUserToken
			? await this.userTokenRepository.remove(
					UserTokenMapper.toTypeORM(aUserToken)
			  )
			: null;

		return deletedUserToken ? UserTokenMapper.toDomain(deletedUserToken) : null;
	}

	async findByUserAndToken(
		user: User,
		token: string
	): Promise<DomainUserToken> {
		const aUser = new User();
		aUser.id = user.id;

		const aUserToken = await this.userTokenRepository.findOne({
			where: {
				user: { id: aUser.id },
				token: token,
			},
		});

		return aUserToken ? UserTokenMapper.toDomain(aUserToken) : null;
	}
}
