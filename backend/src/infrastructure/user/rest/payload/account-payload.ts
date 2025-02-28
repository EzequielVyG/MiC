import { User } from "src/domain/user/model/user.entity"

export class UserAccountPayload {
    id: string
    accountID: string
    provider: string
    name: string
    email: string
    image: string
    user: User
}