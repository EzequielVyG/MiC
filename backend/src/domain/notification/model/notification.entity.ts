import { User } from "src/domain/user/model/user.entity"

export class Notification {
    id: string
    title: string
    description: string
    receiver: User
    status: string
    link: string
    timestamp: Date
}