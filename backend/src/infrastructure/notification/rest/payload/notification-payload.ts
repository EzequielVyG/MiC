import { UserPayload } from "src/infrastructure/user/rest/payload/user-payload"

export class NotificationPayload {
    id: string
    title: string
    description: string
    receiver: UserPayload
    status: string
    link: string
    timestamp: Date
}