import { NotificationPayload } from "../payload/notification-payload";
import { Notification } from '../../../../domain/notification/model/notification.entity';
import { UserRestMapper } from "src/infrastructure/user/rest/mapper/user-rest-mapper";
import { NotificationStatus } from "src/domain/notification/model/notification-status.enum";

const NotificationStatusMap: { [key in NotificationStatus]: string } = {
    [NotificationStatus.READ]: 'Leido',
    [NotificationStatus.RECEIVED]: 'Recibido',
    [NotificationStatus.SENT]: 'Enviado',
};
export class NotificationRestMapper {
    static toPayload(notification: Notification): NotificationPayload {
        return {
            id: notification.id,
            title: notification.title,
            description: notification.description,
            link: notification.link,
            status: NotificationStatusMap[notification.status as NotificationStatus],
            timestamp: notification.timestamp,
            receiver: notification.receiver ? UserRestMapper.toPayload(notification.receiver) : null,
        };
    }
}