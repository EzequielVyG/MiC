import { Notification } from '../model/notification.entity';

export interface IOrchestratorRepository {
    createOne(aNotification: Notification, sendType: "push" | "email")
    createAll(aNotification: Notification[], sendType: "push" | "email")
}

export const IOrchestratorRepository = Symbol('IOrchestratorRepository');
