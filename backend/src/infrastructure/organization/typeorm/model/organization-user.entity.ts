import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Organization } from './organization.entity';
import { User } from '../../../user/typeorm/model/user.entity';

@Entity({ name: 'organization_users' })
export class OrganizationUser {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Organization, (organization) => organization.operators)
    @JoinColumn({ name: 'organization_id' })
    organization: Organization;

    @ManyToOne(() => User, (user) => user)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ nullable: true })
    status: string;

    @CreateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP(6)',
        onUpdate: 'CURRENT_TIMESTAMP(6)',
    })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', default: () => null })
    deletedAt: Date;
}