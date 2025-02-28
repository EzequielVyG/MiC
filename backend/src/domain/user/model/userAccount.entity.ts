import { User } from "./user.entity"

export class UserAccount {
    id: string
    accountID: string;
    provider: string
    name: string
    email: string
    image: string
    user: User
}