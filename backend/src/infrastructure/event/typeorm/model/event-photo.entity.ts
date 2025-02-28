import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Event } from './event.entity';

@Entity({ name: 'event_photos' })
export class EventPhoto {
    @Column({ name: 'id' })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Event, (event) => event.photos)
    @JoinColumn({ name: 'event_id' })
    event: Event;

    @Column({ type: 'varchar' })
    photoUrl: string;
}
