import { Injectable } from '@nestjs/common';
import { EventRepository } from 'src/infrastructure/event/typeorm/repository/event.repository';
import { UserRepository } from 'src/infrastructure/user/typeorm/repository/user.repository';
import * as moment from 'moment';
import { CreateNotification } from 'src/domain/notification/case/createNotification.case';
import { CronJob } from 'cron';

@Injectable()
export class EventNotificationService {
  private notifiedEvents: Set<string> = new Set();
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository,
    private readonly createNotification: CreateNotification,
  ) {
    const dailyCleanupJob = new CronJob('0 2 * * *', () => {
      this.cleanNotifiedEvents();
    });

    dailyCleanupJob.start();
  }

  async notifyUsersForEventsWithinOneHour(): Promise<void> {
    try {
      const currentDate = moment();
      const eventsAndUsers = await this.eventRepository.findEventsWithinOneDay();
        for (const { event_id, user_id } of eventsAndUsers || []) {
        const event = await this.eventRepository.findById(event_id);
        const user = await this.userRepository.findByID(user_id);

        if (!event || !user) {
          console.warn('Evento o usuario no encontrado:', event_id, user_id);
          continue;
        }
        const notificationKey = `${user_id}_${event_id}`;
          if (this.notifiedEvents.has(notificationKey)) {
          console.log(`Evento ya notificado a ${user.name}: ${event.name}`);
          continue;
        }

        const eventStartDate = moment(event.startDate);
        
        const timeDifference = Math.abs(currentDate.diff(eventStartDate, 'minutes'));
        

        if (timeDifference >= 60 && timeDifference <= 75) {
          this.notifiedEvents.add(notificationKey);
          const descr = `${event.name} comienza en 1 hora`
  
          const notificationBody = {
              title: "Evento agendado",
              description: descr,
              link: null,
              receiver: user
          }
  
          await this.createNotification.createByUser(notificationBody.title, notificationBody.description, notificationBody.link, notificationBody.receiver)

        }
      }
    } catch (error) {
      console.error(`Error al notificar a los usuarios: ${error.message}`);
    }
  }

  private async cleanNotifiedEvents(): Promise<void> {
    this.notifiedEvents.clear();
    console.log('Notificaciones limpiadas.');
  }
}
