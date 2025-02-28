import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification as DomainNotification } from 'src/domain/notification/model/notification.entity';
import { INotificationRepository } from 'src/domain/notification/port/iNotificationRepository';
import {
    Notification as TypeORMNotification
} from 'src/infrastructure/notification/typeorm/model/notification.entity';
import { Repository } from 'typeorm';
import { NotificationMapper } from '../mapper/notification-typeorm.mapper';
import { NotificationStatus } from 'src/domain/notification/model/notification-status.enum';

@Injectable()
export class NotificationRepository implements INotificationRepository {
    constructor(
        @InjectRepository(TypeORMNotification)
        private readonly notificationRepository: Repository<TypeORMNotification>,
    ) { }


    async update(aNotification: DomainNotification): Promise<DomainNotification> {
        const typeORMNotification = NotificationMapper.toTypeORM(aNotification);
        const updatedNotification = await this.notificationRepository.save(typeORMNotification);
        return NotificationMapper.toDomain(updatedNotification);
    }


    async findById(id: string): Promise<DomainNotification> {
        const notification = await this.notificationRepository.findOne({ where: { id: id }, relations: ['receiver'] });
        return notification ? NotificationMapper.toDomain(notification) : null;
    }

    async findByUser(userId: string): Promise<DomainNotification[]> {
        const notifications: TypeORMNotification[] = await this.notificationRepository.createQueryBuilder('notification')
            .where('notification.user_id = :userId', { userId })
            .orderBy('notification.timestamp', 'DESC')
            .getMany();

        return notifications.map((notification) => NotificationMapper.toDomain(notification));
    }

    async create(aNotification: DomainNotification): Promise<DomainNotification> {
        const typeORMNotification = NotificationMapper.toTypeORM(aNotification);
        const savedNotification = await this.notificationRepository.save(typeORMNotification);
        return NotificationMapper.toDomain(savedNotification);
    }

    async findAll(): Promise<DomainNotification[]> {
        const notifications: TypeORMNotification[] = await this.notificationRepository.find({
            relations: ['receiver']
        });

        return notifications.map((notification) => NotificationMapper.toDomain(notification));
    }

    async readAll(userId: string): Promise<DomainNotification[]> {
        const someNotifications: TypeORMNotification[] = await this.notificationRepository.createQueryBuilder('notification')
            .where('notification.user_id = :userId', { userId })
            .andWhere('notification.status != :readStatus', {
                readStatus: NotificationStatus.READ
            })
            .orderBy('notification.timestamp', 'DESC')
            .getMany();
        someNotifications.forEach((notification) => {
            notification.status = NotificationStatus.READ;
        })
        const updatedNotifications: TypeORMNotification[] = await this.notificationRepository.save(someNotifications);
        return updatedNotifications.map((notification) => {
            return NotificationMapper.toDomain(notification);
        });
    }

    async findByUserAndNotStatus(userId: string, aAvoidedState: string): Promise<DomainNotification[]> {
        const notifications: TypeORMNotification[] = await this.notificationRepository.createQueryBuilder('notification')
            .where('notification.user_id = :userId', { userId })
            .andWhere('notification.status != :avoidStatus', {
                avoidStatus: aAvoidedState
            })
            .orderBy('notification.timestamp', 'DESC')
            .getMany();

        return notifications.map((notification) => NotificationMapper.toDomain(notification));

    }


}
