
import { User } from "./user.entity";

export class PasswordToken {
    id: string;

    user: User;

    token: string;

    status: string;

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;
}