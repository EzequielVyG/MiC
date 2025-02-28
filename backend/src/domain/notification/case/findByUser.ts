import { IUserRepository } from "src/domain/user/port/iUserRepository";
import { Notification } from "../model/notification.entity";
import { IFindNotificationByUser } from "../port/iFindByUser";
import { INotificationRepository } from "../port/iNotificationRepository";
import { Injectable, Inject } from '@nestjs/common';
import { NotificationStatus } from "../model/notification-status.enum";


@Injectable()
export class FindNotificationsByUser implements IFindNotificationByUser {

    constructor(
        @Inject(INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
        @Inject(IUserRepository)
        private readonly userRepository: IUserRepository
    ) { }


    async findByUser(mail: string): Promise<Notification[]> {
        const user = await this.userRepository.findByEmail(mail)
        if (!user) {
            throw new Error("Usuario no encontrado")
        }

        return this.notificationRepository.findByUser(user.id);
    }

    async findNotReadByUser(mail: string): Promise<Notification[]> {
        const user = await this.userRepository.findByEmail(mail)
        if (!user) {
            throw new Error("Usuario no encontrado")
        }
        return this.notificationRepository.findByUserAndNotStatus(user.id, NotificationStatus.READ);
    }

}