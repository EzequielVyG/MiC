import { User } from "src/domain/user/model/user.entity"

export class CreateUserNotificationInput {
    title: string
    description: string
    link: string
    receiver: User
}