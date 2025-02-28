import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer'; // Import MulterFile type
import { RestoreUserPassword } from 'src/domain/user/case/RestoreUserPassword.case';
import { UpdateUser } from 'src/domain/user/case/updateUserCase';
import { UpdateUserPassword } from 'src/domain/user/case/updateUserPasswordCase';
import { UserHasPermission } from 'src/domain/user/case/userHasPermission.case';
import { responseJson } from 'src/util/responseMessage';
import { FindUsers } from '../../../../domain/user/case/findUsers.case';
import { LoginUser } from '../../../../domain/user/case/loginUser.case';
import { LogoutUser } from '../../../../domain/user/case/logoutUser.case';

import { DeleteLogicUser } from 'src/domain/user/case/deleteLogicUser.case';
import { FindByContrasenia } from 'src/domain/user/case/findByContrasenia.case';
import { FindRoles } from 'src/domain/user/case/findRoles.case';
import { SubscribeToEvent } from 'src/domain/user/case/subscribeToEvent.case';
import { Role } from 'src/domain/user/model/role.entity';
import { RegisterUser } from '../../../../domain/user/case/registerUser.case';
import { SaveUserToken } from '../../../../domain/user/case/saveUserToken.case';
import { User } from '../../../../domain/user/model/user.entity';
import { ChangePasswordInput } from '../input/change-password-input';
import { LoginUserInput } from '../input/login-user-input';
import { LogoutUserInput } from '../input/logout-user-input';
import { RegisterPasarelaUserInput } from '../input/register-pasarela-user-input';
import { RegisterUserInput } from '../input/register-user-input';
import { SaveTokenUserInput } from '../input/saveToken-user-input';
import { SubscribeToEventInput } from '../input/subscribe-event.input';
import { UpdateUserInput } from '../input/update-user.input';
import { UserForgotPasswordInput } from '../input/user-forgot.password.input';
import { UserGetPasswordTokenInput } from '../input/user-get-password-token.input';
import { UserRestorePasswordInput } from '../input/user-restore-password.input';
import { UserRestMapper } from '../mapper/user-rest-mapper';
import { UserPayload } from '../payload/user-payload';
import { UserAccountInput } from '../input/user-account-input';
import { LinkAccount } from 'src/domain/user/case/linkAccount.case';
import { FindByPasarelaInput } from '../input/find-by-pasarela-input';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('users')
export class UserController {
	constructor(
		private readonly findUsers: FindUsers,
		private readonly registerUser: RegisterUser,
		private readonly saveUserToken: SaveUserToken,
		private readonly loginUser: LoginUser,
		private readonly logoutUser: LogoutUser,
		private readonly updateUser: UpdateUser,
		private readonly updateUserPassword: UpdateUserPassword,
		private readonly restoreUserPassword: RestoreUserPassword,
		private readonly userHasPermission: UserHasPermission,
		private readonly subscribeEvent: SubscribeToEvent,
		private readonly findContrasenia: FindByContrasenia,
		private readonly linkAccount: LinkAccount,
		private readonly deleteLogicUser: DeleteLogicUser,
		private readonly findRoles: FindRoles,
	) { }


	@Get()
	async findAll(): Promise<UserPayload[]> {
		try {
			const someUsers: User[] = await this.findUsers.findAll();
			return responseJson(
				200,
				'Usuarios recuperados con éxito',
				someUsers.map((aUser) => {
					return UserRestMapper.toPayload(aUser);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('provider/find')
	async findByProvider(@Body() findParameter: FindByPasarelaInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.findUsers.findByProvider(findParameter.email, findParameter.provider, findParameter.accountID);
			return responseJson(
				200,
				'Usuario por provider recuperados con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('roles')
	async findAllRoles(): Promise<Role[]> {
		try {
			const someRoles: Role[] = await this.findRoles.findAll();
			return responseJson(
				200,
				'Usuarios recuperados con éxito',
				someRoles.map((aRole) => {
					return (aRole);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}


	@Get('id/:id')
	async findById(@Param('id') id: string): Promise<UserPayload> {
		try {
			const aUser: User = await this.findUsers.findById(id);
			return responseJson(
				200,
				'Usuarios recuperados con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('login')
	async login(@Body() user: LoginUserInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.loginUser.login(
				user.email,
				user.password,
				user.token
			);
			return responseJson(
				200,
				'Login exitoso',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('loginMIC')
	async loginMIC(@Body() user: LoginUserInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.loginUser.loginMIC(
				user.email,
				user.password
			);
			return responseJson(
				200,
				'Login en gestion MIC exitoso',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('logout')
	async logout(@Body() userData: LogoutUserInput) {
		try {
			await this.logoutUser.logout(userData.email, userData.token);
			return responseJson(200, 'Login exitoso');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	async register(@Body() user: RegisterUserInput): Promise<UserPayload> {
		try {
			const aUser: User = await this.registerUser.register(
				user.email,
				user.password,
			);
			return responseJson(
				200,
				'Usuario registrado con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('provider/:provider')
	async registerPasarela(
		@Param('provider') provider: string,
		@Body() user: RegisterPasarelaUserInput
	): Promise<UserPayload> {
		try {
			const aUser: User = await this.registerUser.registerPasarela(
				user.name,
				user.avatar,
				user.email,
				provider,
				user.accountID,
				user.fcmToken
			);
			return responseJson(
				200,
				'Usuario registrado con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('linkAccount/:email')
	async linkAccountPasarela(
		@Param('email') email: string,
		@Body() account: UserAccountInput
	): Promise<UserPayload> {
		try {
			const aUser: User = await this.linkAccount.linkAccountToUser(
				email,
				account.email,
				account.image,
				account.name,
				account.provider,
				account.accountID,
			);
			return responseJson(
				200,
				'Cuenta linkeada con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('saveToken')
	async saveToken(@Body() userToken: SaveTokenUserInput): Promise<UserPayload> {
		try {
			await this.saveUserToken.saveUserToken(userToken.email, userToken.token);
			return responseJson(200, 'Usuario registrado con éxito');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('activate/:id')
	async activate(@Param('id') id: string): Promise<UserPayload> {
		try {
			const aUser: User = await this.registerUser.activate(id);
			return responseJson(
				200,
				'Usuario activado con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	@UseInterceptors(FileInterceptor('avatar'))
	async update(
		@UploadedFile() avatar: MulterFile,
		@Body() user: UpdateUserInput
	): Promise<UserPayload> {
		try {
			if (avatar) {
				let extension = avatar.originalname.split('.');
				extension = '.' + extension[extension.length - 1];
				avatar.originalName = user.email + extension;
				avatar.mimetype = 'image/jpg';
			}
			const aUser: User = await this.updateUser.update(
				user.name,
				user.email,
				user.fechaNacimiento,
				avatar,
				user.favoriteEvents ? JSON.parse(user.favoriteEvents) : null,
				user.preferences ? JSON.parse(user.preferences) : [],
				user.roles ? JSON.parse(user.roles) : [],
			);
			return responseJson(
				200,
				'Usuario actualizado con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put(':email')
	async changePassword(
		@Param('email') email: string,
		@Body() user: ChangePasswordInput
	): Promise<UserPayload> {
		try {
			const aUser: User = await this.updateUserPassword.changePassword(
				email,
				user.actualPassword,
				user.newPassword,
				user.checkNewPassword
			);
			return responseJson(
				200,
				'Contraseña actualizada con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('subscribeToEvent/:email')
	async subscribeToEvent(
		@Param('email') email: string,
		@Body() body: SubscribeToEventInput
	): Promise<UserPayload> {
		try {
			const aUser: User = await this.subscribeEvent.subscribe(email, body);

			return responseJson(
				200,
				'Usuario suscrito al evento con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('unsubscribeToEvent/:email')
	async unsubscribeToEvent(
		@Param('email') email: string,
		@Body() body: SubscribeToEventInput
	): Promise<UserPayload> {
		try {
			const aUser: User = await this.subscribeEvent.unsubscribe(email, body);

			return responseJson(
				200,
				'Usuario desuscrito al evento con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('email/:email')
	async findByMail(@Param('email') email: string): Promise<UserPayload> {
		try {
			const aUser: User = await this.findUsers.findByEmail(email);
			return responseJson(
				200,
				'Usuarios recuperados con éxito',
				UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('forgotMyPassword')
	async forgotMyPassword(
		@Body() body: UserForgotPasswordInput
	): Promise<UserPayload> {
		try {
			// const aUser: User = await this.findUsers.findByEmail(body.email);

			await this.restoreUserPassword.sendPasswordToken(body.email);
			return responseJson(200, 'Mail de recuperacion enviado con éxito');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('passwordToken')
	async getPasswordTokenData(
		@Body() body: UserGetPasswordTokenInput
	): Promise<UserPayload> {
		try {
			const response = await this.restoreUserPassword.getPasswordTokenData(
				body.token
			);
			return responseJson(200, 'Token recuperado con éxito', response);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('resetPassword')
	async restorePassword(
		@Body() body: UserRestorePasswordInput
	): Promise<UserPayload> {
		try {
			const response = await this.restoreUserPassword.restorePassword(
				body.email,
				body.password,
				body.token
			);
			return responseJson(
				200,
				'Token recuperado con éxito',
				response
				// UserRestMapper.toPayload(aUser)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('canAccess')
	async userCanAccess(@Body() body: any): Promise<UserPayload> {
		try {
			const hasPermission = await this.userHasPermission.grantAccess(
				body.email,
				body.action,
				body.resource
			);

			return responseJson(
				200,
				'El usuario cuenta con los permisos',
				hasPermission
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('findByContrasenia/:email')
	async findByContrasenia(@Param('email') email: string): Promise<boolean> {
		try {
			const isPasswordNull = await this.findContrasenia.findByContrasenia(
				email
			);
			return isPasswordNull;
		} catch (error) {
			return false;
		}
	}

	@Delete('/id/:id')
	async delete(@Param('id') id: string): Promise<UserPayload> {
		try {
			const aUser: User = await this.deleteLogicUser.deleteLogic(id);
			return aUser
				? responseJson(
					200,
					`${aUser.name} eliminado con exito`,
					UserRestMapper.toPayload(aUser)
				)
				: responseJson(500, 'No existe un usuario con ese id');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

}
