import { Notification } from '../model/notification.entity';

export interface INotificationRepository {
    findAll(): Promise<Notification[]>;
    findById(id: string): Promise<Notification>;
    update(aNotification: Notification): Promise<Notification>;
    findByUser(userId: string): Promise<Notification[]>
    create(aNotification: Notification): Promise<Notification>
    readAll(userId: string): Promise<Notification[]>
    findByUserAndNotStatus(userId: string, aAvoidedState: string): Promise<Notification[]>

}

export const INotificationRepository = Symbol('INotificationRepository');
