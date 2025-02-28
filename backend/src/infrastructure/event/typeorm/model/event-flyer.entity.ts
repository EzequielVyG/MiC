import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity({ name: 'event_flyers' })
export class EventFlyer {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Event, (event) => event.flyers)
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ type: 'varchar' })
    flyerUrl: string;
}
