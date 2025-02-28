import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
} from '@nestjs/common';
import { responseJson } from 'src/util/responseMessage';
import { NotificationPayload } from '../payload/notification-payload';
import { NotificationRestMapper } from '../mapper/notification-rest-mapper';
import { Notification } from '../../../../domain/notification/model/notification.entity';
import { FindAllNotifications } from 'src/domain/notification/case/findAllNotifications.case';
import { CreateUserNotificationInput } from '../input/create-user-notification-input';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { CreateOrganizationNotificationsInput } from '../input/create-organization-notifications-input';
import { FindNotificationsByUser } from 'src/domain/notification/case/findByUser';
import { CreateOrganizationsNotificationsInput } from '../input/create-organizations-notifications-input';
import { ReadNotification } from 'src/domain/notification/case/readNotification.case';

@Controller('notifications')
export class NotificationController {
    constructor(
        private readonly findAllNotifications: FindAllNotifications,
        private readonly findNotificationsByUser: FindNotificationsByUser,
        private readonly createNotification: CreateNotification,
        private readonly readNotification: ReadNotification
    ) { }

    @Get()
    async findAll(): Promise<NotificationPayload[]> {
        try {
            const someNotifications: Notification[] = await this.findAllNotifications.findAll();
            return responseJson(
                200,
                'Notificaciones recuperados con exito',
                someNotifications.map((aNotification) => {
                    return NotificationRestMapper.toPayload(aNotification);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Get('notRead/user/:email')
    async findNotReadByUser(@Param('email') email: string): Promise<NotificationPayload[]> {
        try {
            const someNotifications: Notification[] = await this.findNotificationsByUser.findNotReadByUser(email);
            return responseJson(
                200,
                'Notificaciones recuperados con exito',
                someNotifications.map((aNotification) => {
                    return NotificationRestMapper.toPayload(aNotification);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Get('user/:email')
    async findByUser(@Param('email') email: string): Promise<NotificationPayload[]> {
        try {
            const someNotifications: Notification[] = await this.findNotificationsByUser.findByUser(email);
            return responseJson(
                200,
                'Notificaciones recuperados con exito',
                someNotifications.map((aNotification) => {
                    return NotificationRestMapper.toPayload(aNotification);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Put('/read/:id')
    async readOne(@Param('id') id: string): Promise<NotificationPayload[]> {
        try {
            const aNotification: Notification = await this.readNotification.readOne(id);
            return responseJson(
                200,
                'Notificaciones recuperados con exito',
                   NotificationRestMapper.toPayload(aNotification)
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Put('/readAll/user/:email')
    async readAll(@Param('email') email: string): Promise<NotificationPayload[]> {
        try {
            const someNotifications: Notification[] = await this.readNotification.readAll(email);
            return responseJson(
                200,
                'Notificaciones recuperados con exito',
                someNotifications.map((aNotification) => {
                   return NotificationRestMapper.toPayload(aNotification)
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post('/user')
    async createByUser(@Body() notification: CreateUserNotificationInput): Promise<NotificationPayload> {
        try {
            const aNotification: Notification = await this.createNotification.createByUser(
                notification.title,
                notification.description,
                notification.link,
                notification.receiver

            );
            return responseJson(
                200,
                'Notificacion creada con exito',
                NotificationRestMapper.toPayload(aNotification)
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post('/organization')
    async createByOrganization(@Body() notification: CreateOrganizationNotificationsInput): Promise<NotificationPayload> {
        try {
            const someNotifications: Notification[] = await this.createNotification.createByOrganization(
                notification.title,
                notification.description,
                notification.link,
                notification.organization
            );
            return responseJson(
                200,
                'Notificaciones creada con exito',
                someNotifications.map((aNotification) => {
                    return NotificationRestMapper.toPayload(aNotification);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }

    @Post('/organizations')
    async createByOrganizations(@Body() notification: CreateOrganizationsNotificationsInput): Promise<NotificationPayload> {
        try {
            const someNotifications: Notification[] = await this.createNotification.createByOrganizations(
                notification.title,
                notification.description,
                notification.link,
                notification.organizations
            );
            return responseJson(
                200,
                'Notificaciones creada con exito',
                someNotifications.map((aNotification) => {
                    return NotificationRestMapper.toPayload(aNotification);
                })
            );
        } catch (error) {
            return responseJson(500, error.message);
        }
    }
}