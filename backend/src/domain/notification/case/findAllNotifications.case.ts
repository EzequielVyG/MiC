import { Injectable, Inject } from '@nestjs/common';
import { IFindAllNotifications } from '../port/iFindAllNotifications';
import { INotificationRepository } from '../port/iNotificationRepository';
import { Notification } from '../model/notification.entity';

@Injectable()
export class FindAllNotifications implements IFindAllNotifications {
    constructor(
        @Inject(INotificationRepository)
        private readonly notificationRepository: INotificationRepository
    ) { }

    async findAll(): Promise<Notification[]> {
        return this.notificationRepository.findAll();
    }
}
