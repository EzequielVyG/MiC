import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	OneToMany,
	Point,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../../category/typeorm/model/category.entity';
import { Event } from '../../../event/typeorm/model/event.entity';
import { Organization } from '../../../organization/typeorm/model/organization.entity';
import { Accessibility } from './accesibility.entity';
import { PlacePhoto } from './place-photo.entity';
import { PlaceSchedule } from './place-schedule.entity';
import { Service } from './service.entity';

@Entity({ name: 'places' })
export class Place {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'description', nullable: true })
	description: string;

	@Column({ name: 'note', nullable: true })
	note: string;

	@OneToMany(() => PlaceSchedule, (schedule) => schedule.place)
	schedules: PlaceSchedule[];

	@OneToMany(() => PlacePhoto, (photo) => photo.place)
	photos: PlacePhoto[];

	@ManyToOne(() => Category, (principalCategory) => principalCategory)
	principalCategory: Category;

	@ManyToMany(() => Category)
	@JoinTable({
		name: 'place_categories',
		joinColumn: {
			name: 'place_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'category_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	categories: Category[];

	@Column({ name: 'url', nullable: true })
	url: string;

	@Column({ name: 'facebook_url', nullable: true })
	facebook_url: string;

	@Column({ name: 'twitter_url', nullable: true })
	twitter_url: string;

	@Column({ name: 'instagram_url', nullable: true })
	instagram_url: string;

	@Column({ name: 'cmi', nullable: true })
	cmi: string;

	@Column({ name: 'phone', nullable: true })
	phone: string;

	@Column({ name: 'domicile', nullable: true })
	domicile: string;

	@Column({
		type: 'geography',
		spatialFeatureType: 'Point',
		name: 'location',
		nullable: true,
		srid: 4326,
	})
	location: Point;

	@Column({ name: 'origin' })
	origin: string;

	@Column({ name: 'minors' })
	minors: string;

	@ManyToMany(() => Accessibility)
	@JoinTable({
		name: 'place_accessibilities',
		joinColumn: {
			name: 'place_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'accessibility_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	accessibilities: Accessibility[];

	@ManyToMany(() => Service)
	@JoinTable({
		name: 'place_services',
		joinColumn: {
			name: 'place_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'service_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	services: Service[];

	@ManyToOne(() => Organization, (organization) => organization)
	organization: Organization;

	@OneToMany(() => Event, (event) => event.place)
	events: Event[];

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
