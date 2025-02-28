import { Organization } from "src/domain/organization/model/organization.entity";
import { User } from "src/domain/user/model/user.entity";
import { Notification } from "../model/notification.entity";

export interface ICreateNotification {
    createByUser(
        title: string,
        description: string,
        link: string,
        receiver: User
    ): Promise<Notification>;

    createByOrganization(
        title: string,
        description: string,
        link: string,
        organization: Organization
    ): Promise<Notification[]>;

    createByOrganizations(
        title: string,
        description: string,
        link: string,
        organizations: Organization[]
    ): Promise<Notification[]>;
}