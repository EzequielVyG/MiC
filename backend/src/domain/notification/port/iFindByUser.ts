import { Notification } from '../model/notification.entity';

export interface IFindNotificationByUser {
    findByUser(mail: string): Promise<Notification[]>;
}
