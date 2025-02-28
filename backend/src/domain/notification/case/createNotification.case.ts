import { User } from "src/domain/user/model/user.entity";
import { ICreateNotification } from "../port/iCreateNotification";
import { INotificationRepository } from "../port/iNotificationRepository";
import { IOrchestratorRepository } from "../port/iOrchestratorRepository";

import { Inject, Injectable } from '@nestjs/common';
import { Organization } from "src/domain/organization/model/organization.entity";
import { NotificationStatus } from "../model/notification-status.enum";
import { Notification } from "../model/notification.entity";
// import { IOrganizationRepository } from "src/domain/organization/port/iOrganizationRepository";

@Injectable()
export class CreateNotification implements ICreateNotification {
    constructor(
        @Inject(INotificationRepository)
        private readonly notificationRepository: INotificationRepository,
        @Inject(IOrchestratorRepository)
        private readonly orchestratorRepository: IOrchestratorRepository,
        // @Inject(IOrganizationRepository)
        // private readonly organizationRepository: IOrganizationRepository
    ) { }


    async createByOrganizations(title: string, description: string, link: string, organizations: Organization[]): Promise<Notification[]> {
        let allNotifications: Notification[] = []

        for (const organization of organizations) {
            const organizationNotifications = await this.createByOrganization(title, description, link, organization)
            allNotifications = allNotifications.concat(organizationNotifications)
        }

        return allNotifications
    }


    async createByOrganization(title: string, description: string, link: string, organization: Organization) {
        // organization = await this.organizationRepository.findByID(organization.id)
        let users: any = organization.operators.filter((aOper) => { return aOper.status === 'ACCEPTED' });
        let ownerUser;
        if (organization.owner) {
            //esto hace falta porque operadores es de tipo organizationUser y owner de tipo User
            ownerUser = {
                id: organization.owner.id,
                organization: organization,
                user: organization.owner,
                status: 'ACCEPTED',
                createdAt: organization.owner.createdAt,
                updatedAt: organization.owner.updatedAt,
                deletedAt: organization.owner.deletedAt,
            };
        }
        if (ownerUser) 
            users.push(ownerUser);
        users = users.map((aOper) => aOper.user)
        const uniqueUsers = this.deleteDuplicates(users)

        const someNotificationsToSend: Notification[] = []
        for (const user of uniqueUsers) {
            console.log(user)
            if (user !== null) {
                const newNotification = this.createNotification(title, description, link, user)

                const aNotificationEntity = await this.notificationRepository.create(newNotification);
                someNotificationsToSend.push(aNotificationEntity)
            }
        }

        await this.orchestratorRepository.createAll(someNotificationsToSend, "push")

        return someNotificationsToSend
    }

    async createByUser(title: string, description: string, link: string, receiver: User) {
        const aNotification = new Notification()
        aNotification.title = title
        aNotification.description = description
        aNotification.link = link
        aNotification.receiver = receiver
        aNotification.status = NotificationStatus.SENT
        aNotification.timestamp = new Date()

        const aNotificationEntity = await this.notificationRepository.create(aNotification);

        await this.orchestratorRepository.createOne(aNotificationEntity, "push")

        return aNotificationEntity
    }

    private createNotification(title: string, description: string, link: string, receiver: User): Notification {
        const aNotification = new Notification()
        aNotification.title = title
        aNotification.description = description
        aNotification.link = link
        aNotification.receiver = receiver
        aNotification.status = NotificationStatus.SENT
        aNotification.timestamp = new Date()
        return aNotification
    }

    private deleteDuplicates(someUsers: User[]): User[] {
        const idSet = new Set();
        const uniqueUsers = someUsers.filter(aUser => {

            if (!aUser || typeof aUser.id === 'undefined') {
                return false;
            }

            if (idSet.has(aUser.id)) {
                return false;
            }

            idSet.add(aUser.id);
            return true;
        });

        return uniqueUsers;
    }
}