import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { DayOfWeek } from './day-of-week.entity';
import { Place } from './place.entity';

@Entity({ name: 'place_schedules' })
export class PlaceSchedule {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Place, (place) => place.schedules)
	place: Place;

	@ManyToOne(() => DayOfWeek, (dayOfWeek) => dayOfWeek.schedules)
	dayOfWeek: DayOfWeek;

	@Column('time')
	openingHour: string;

	@Column('time')
	closingHour: string;
}
