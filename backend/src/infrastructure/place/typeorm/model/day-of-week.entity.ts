import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PlaceSchedule } from './place-schedule.entity';

@Entity({ name: 'days_of_weeks' })
export class DayOfWeek {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ unique: true })
	name: string; // Ejemplo: "Lunes", "Martes", ...

	@OneToMany(() => PlaceSchedule, (schedule) => schedule.dayOfWeek)
	schedules: PlaceSchedule[];
}
