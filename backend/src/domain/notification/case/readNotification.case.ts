import { Injectable, Inject } from '@nestjs/common';
import { INotificationRepository } from '../port/iNotificationRepository';
import { IReadNotification } from '../port/iReadNotification';
import { Notification } from '../model/notification.entity';
import { IUserRepository } from 'src/domain/user/port/iUserRepository';
import { NotificationStatus } from '../model/notification-status.enum';

@Injectable()
export class ReadNotification implements IReadNotification {
    constructor(
        @Inject(INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository
    ) { }

    async readOne(id: string): Promise<Notification> {
        const aNotification = await this.notificationRepository.findById(id)
        if (!aNotification) {
            throw new Error("Notificacion no encontrada")
        }

        aNotification.status = NotificationStatus.READ

        return await this.notificationRepository.update(aNotification);
    }

    async readAll(mail: string): Promise<Notification[]> {
        const user = await this.userRepository.findByEmail(mail)
        if (!user) {
            throw new Error("Usuario no encontrado")
        }

        return await this.notificationRepository.readAll(user.id);
    }

}
