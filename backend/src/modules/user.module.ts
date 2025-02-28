import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestoreUserPassword } from 'src/domain/user/case/RestoreUserPassword.case';
import { DeleteLogicUser } from 'src/domain/user/case/deleteLogicUser.case';
import { FindRoles } from 'src/domain/user/case/findRoles.case';
import { LoginUser } from 'src/domain/user/case/loginUser.case';
import { LogoutUser } from 'src/domain/user/case/logoutUser.case';
import { RegisterUser } from 'src/domain/user/case/registerUser.case';
import { UpdateUser } from 'src/domain/user/case/updateUserCase';
import { UpdateUserPassword } from 'src/domain/user/case/updateUserPasswordCase';
import { UserHasPermission } from 'src/domain/user/case/userHasPermission.case';
import { IRoleRepository } from 'src/domain/user/port/IRoleRepository';
import { IPasswordTokenRepository } from 'src/domain/user/port/iPasswordTokenRepository';
import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';
import { PasswordToken } from 'src/infrastructure/user/typeorm/model/passwordToken.entity';
import { Role } from 'src/infrastructure/user/typeorm/model/role.entity';
import { UserToken } from 'src/infrastructure/user/typeorm/model/userToken.entity';
import { PasswordTokenRepository } from 'src/infrastructure/user/typeorm/repository/passwordToken.repository';
import { RoleRepository } from 'src/infrastructure/user/typeorm/repository/role.repository';
import { UserAccountRepository } from 'src/infrastructure/user/typeorm/repository/userAccount.repository';
import { UserTokenRepository } from 'src/infrastructure/user/typeorm/repository/userToken.repository';
import { MinioClientModule } from 'src/minio-client/minio-client.module';
import { FindUsers } from '../domain/user/case/findUsers.case';
import { IUserRepository } from '../domain/user/port/iUserRepository';
import { UserController } from '../infrastructure/user/rest/controller/user.controller';
import { User } from '../infrastructure/user/typeorm/model/user.entity';
import { UserRepository } from '../infrastructure/user/typeorm/repository/user.repository';
import { SaveUserToken } from 'src/domain/user/case/saveUserToken.case';
import { FindByContrasenia } from 'src/domain/user/case/findByContrasenia.case';
import { IUserAccountRepository } from 'src/domain/user/port/iUserAccountRepository';
import { UserAccount } from 'src/infrastructure/user/typeorm/model/userAccount.entity';
import { SubscribeToEvent } from 'src/domain/user/case/subscribeToEvent.case';
import { UserPreference } from 'src/infrastructure/user/typeorm/model/user-preference.entity';
import { LinkAccount } from 'src/domain/user/case/linkAccount.case';

@Module({
	imports: [
		TypeOrmModule.forFeature([UserAccount]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Role]),
		TypeOrmModule.forFeature([PasswordToken]),
		TypeOrmModule.forFeature([UserToken]),
		TypeOrmModule.forFeature([UserPreference]),
		MinioClientModule,
	],
	controllers: [UserController],
	providers: [
		FindUsers,
		RegisterUser,
		LoginUser,
		LogoutUser,
		UpdateUser,
		UpdateUserPassword,
		RestoreUserPassword,
		UserHasPermission,
		SubscribeToEvent,
		FindByContrasenia,
		SaveUserToken,
		LinkAccount,
		DeleteLogicUser,
		FindRoles,
		{
			provide: IUserRepository,
			useClass: UserRepository,
		},
		{
			provide: IRoleRepository,
			useClass: RoleRepository,
		},
		{
			provide: IPasswordTokenRepository,
			useClass: PasswordTokenRepository,
		},
		{
			provide: IUserTokenRepository,
			useClass: UserTokenRepository,
		},
		{
			provide: IUserAccountRepository,
			useClass: UserAccountRepository,
		},
	],
})
export class UserModule { }
