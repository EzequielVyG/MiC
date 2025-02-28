
import { User } from "./user.entity";

export class UserToken {
    id: string;

    user: User;

    token: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}