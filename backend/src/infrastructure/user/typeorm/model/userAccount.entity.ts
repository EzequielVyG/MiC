import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'user_accounts' })
export class UserAccount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'account_id', nullable: true })
    accountID: string;

    @Column()
    provider: string; // Ejemplo: 'google', 'facebook', etc.

    @Column()
    email: string;

    @Column({ name: 'name', nullable: true })
    name: string;

    @Column({ name: 'image', nullable: true })
    image: string;

    @JoinColumn({ name: 'user_id' })
    @ManyToOne(() => User, user => user.accounts)
    user: User;
}
