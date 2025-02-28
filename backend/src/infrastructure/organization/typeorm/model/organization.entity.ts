import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Category } from '../../../category/typeorm/model/category.entity';
import { EventParticipant } from '../../../event/typeorm/model/event-participant.entity';
import { Document } from '../../../organization/typeorm/model/document.entity';
import { User } from '../../../user/typeorm/model/user.entity';
import { OrganizationUser } from './organization-user.entity';

@Entity({ name: 'organizations' })
export class Organization {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'legalName', nullable: false })
    legalName: string;

    @Column({ name: 'address' })
    address: string;

    @Column({ name: 'cuit', nullable: false })
    cuit: string;

    @ManyToOne(() => Category, (principalCategory) => principalCategory)
    principalCategory: Category;

    @ManyToMany(() => Category, { nullable: false })
    @JoinTable({
        name: 'organization_categories',
        joinColumn: {
            name: "organization_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "category_id",
            referencedColumnName: "id"
        }
    })
    categories: Category[];

    @Column({ name: 'cmi' })
    cmi: string;

    @Column({ name: 'phone', nullable: false })
    phone: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner' })
    owner: User;

    @OneToMany(() => OrganizationUser, (operator) => operator.organization)
    operators: OrganizationUser[];

    @OneToMany(() => Document, document => document.organization)
    supportingDocumentation: Document[];

    @Column({ name: 'status' })
    status: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'validator' })
    validator: User;

    @OneToMany(() => EventParticipant, (participant) => participant.organization)
    participants: EventParticipant[];

    @Column({ name: 'facebook_url' })
    facebook_url: string;

    @Column({ name: 'twitter_url' })
    twitter_url: string;

    @Column({ name: 'instagram_url' })
    instagram_url: string;

    @Column({ name: 'email' })
    email: string;

    @Column({ name: 'web_organization_url' })
    web_organization_url: string;

    @Column({ name: 'description' })
    description: string;

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
