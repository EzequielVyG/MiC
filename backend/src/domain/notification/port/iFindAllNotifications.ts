import { Notification } from '../model/notification.entity';

export interface IFindAllNotifications {
    findAll(): Promise<Notification[]>;
}
