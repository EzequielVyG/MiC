import { Inject, Injectable } from '@nestjs/common';
import { Notification } from 'src/domain/notification/model/notification.entity';
import { IOrchestratorRepository } from 'src/domain/notification/port/iOrchestratorRepository';
import { IUserTokenRepository } from 'src/domain/user/port/iUserTokenRepository';

import { EmailService } from '../../../util/email.service';
import FirebaseAdminSingleton from './firebase';
const emailService = new EmailService();

require('dotenv').config();

@Injectable()
export class OrchestratorRepository implements IOrchestratorRepository {
    constructor(
        @Inject(IUserTokenRepository)
        private userTokenRepository: IUserTokenRepository
    ) { }

    async createOne(aNotification: Notification, sendType: "push" | "email") {
        const userTokens = await this.userTokenRepository.findByUser(aNotification.receiver)
        userTokens.map(async (userToken) => {
            try {
                if (sendType === "push") {
                    // Define el mensaje de la notificación
                    const message = {
                        notification: {
                            title: aNotification.title,
                            body: aNotification.description,
                            icon: "/logo_manifiesto.png"
                        },
                        data: {
                            status: aNotification.status, title: aNotification.title,
                            body: aNotification.description,
                            link: aNotification.link ? process.env.FRONT_URL + aNotification.link : null,
                        },

                        token: userToken.token,
                    };
                    console.log("Enviando notifivacion")
                    // Envía la notificación push a través de FCM
                    const response = await FirebaseAdminSingleton.getInstance().getAdminInstance().messaging().send(message);
                    console.log(response)

                    // Puedes manejar la respuesta aquí, por ejemplo, registrar el resultado
                }

                if (sendType === "email") {
                    await emailService.sendEmailNotification(aNotification.title, aNotification.description, aNotification.receiver.email, aNotification.link);
                }

            } catch (error) {
                // Maneja los errores aquí
                console.error('Error al enviar la notificación:', error);
            }
        })
    }

    createAll(aNotifications: Notification[], sendType: "push" | "email") {
        try {
            // Define el mensaje de la notificación
            aNotifications.map((not) => {
                this.createOne(not, sendType)
            })
        }
        catch (error) {
            // Maneja los errores aquí
            console.error('Error al enviar la notificación:', error);
        }
    }
}


