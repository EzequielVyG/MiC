import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Organization } from '../../../organization/typeorm/model/organization.entity';
import { Event } from './event.entity';

@Entity({ name: 'event_participants' })
export class EventParticipant {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Event, (event) => event.participants)
    @JoinColumn()
    event: Event;

    @ManyToOne(() => Organization, (organization) => organization.participants)
    organization: Organization;

    @Column()
    role: string;

    @Column({ nullable: true })
    status: string;

}