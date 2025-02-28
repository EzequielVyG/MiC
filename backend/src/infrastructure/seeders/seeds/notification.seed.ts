import { Notification } from '../../notification/typeorm/model/notification.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { User } from '../../user/typeorm/model/user.entity';
import data = require("./json/notifications.json");

require('dotenv').config();

export default class NotificationsSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        console.log("Seeders Notification...");
        const notificationRepository = dataSource.getRepository(Notification);
        const userRepository = dataSource.getRepository(User);

        const notificationsToInsert: Notification[] = await Promise.all(data.map(async (notificationData) => {
            const notification = new Notification();

            notification.title = notificationData.title;
            notification.description = notificationData.description || '';
            const receiver = await userRepository.findOne({
                where: { email: notificationData.receiver.email },
            });
            notification.receiver = receiver;
            notification.status = notificationData.status;
            notification.link = process.env.FRONT_URL + notificationData.link;
            notification.timestamp = new Date(notificationData.timestamp);

            return notification;
        }));

        const notifications = notificationRepository.create(notificationsToInsert);

        await notificationRepository.save(notifications);
    }
}
