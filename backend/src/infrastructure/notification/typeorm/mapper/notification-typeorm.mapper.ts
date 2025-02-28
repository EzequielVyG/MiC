import { UserMapper } from 'src/infrastructure/user/typeorm/mapper/user-typeorm.mapper';
import { Notification as DomainNotification } from '../../../../domain/notification/model/notification.entity';
import { Notification as TypeORMNotification } from '../model/notification.entity';

export class NotificationMapper {
	static toDomain(notification: TypeORMNotification): DomainNotification {
		return {
			id: notification.id,
			title: notification.title,
			description: notification.description || '',
			receiver: notification.receiver
				? UserMapper.toDomain(notification.receiver)
				: null,
			status: notification.status || '',
			link: notification.link || '',
			timestamp: notification.timestamp || null,
		};
	}

	static toTypeORM(
		domainNotification: DomainNotification
	): TypeORMNotification {
		const typeORMNotification = new TypeORMNotification();
		typeORMNotification.id = domainNotification.id;
		typeORMNotification.title = domainNotification.title;
		typeORMNotification.description = domainNotification.description || '';
		typeORMNotification.receiver = domainNotification.receiver
			? UserMapper.toTypeORM(domainNotification.receiver)
			: null;
		typeORMNotification.status = domainNotification.status || '';
		typeORMNotification.link = domainNotification.link || '';
		typeORMNotification.timestamp = domainNotification.timestamp || null;
		return typeORMNotification;
	}
}
