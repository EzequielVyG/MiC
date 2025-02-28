
import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
    Entity,
    JoinColumn,
    JoinTable,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../../category/typeorm/model/category.entity';
import { Place } from '../../../place/typeorm/model/place.entity';
import { User } from '../../../user/typeorm/model/user.entity';
import { EventParticipant } from './event-participant.entity';
import { EventPhoto } from './event-photo.entity';
import { EventFlyer } from './event-flyer.entity';

@Entity({ name: 'events' })
export class Event {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column({ name: 'minors', nullable: true })
    minors: string;

    @ManyToOne(() => Category, (category) => category)
    @JoinColumn({ name: 'principalCategoryId' })
    principalCategory: Category;

    @ManyToMany(() => Category)
    @JoinTable({
        name: 'event_categories',
        joinColumn: {
            name: 'event_id', // Debe ser el nombre de la columna en la tabla intermedia
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'category_id', // Debe ser el nombre de la columna en la tabla intermedia
            referencedColumnName: 'id',
        },
    })
    categories: Category[];

    @ManyToOne(() => Place, (place) => place.id)
    @JoinColumn({ name: 'place_id' })
    place: Place;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'user_id' })
    creator: User;

    @Column({ name: 'start_date', type: 'timestamp with time zone' })
    startDate: Date;

    @Column({ name: 'end_date', type: 'timestamp with time zone', nullable: true })
    endDate: Date;

    @Column()
    price: string;

    @OneToMany(() => EventPhoto, (photo) => photo.event)
    photos: EventPhoto[];

    @OneToMany(() => EventFlyer, (flyer) => flyer.event)
    flyers: EventFlyer[];

    @Column({ nullable: true })
    url: string;

    @Column({ name: 'url_ticketera', nullable: true })
    urlTicketera: string;

    @Column()
    status: string;

    @Column()
    origin: string;

    @OneToMany(() => EventParticipant, (participant) => participant.event)
    participants: EventParticipant[];

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
