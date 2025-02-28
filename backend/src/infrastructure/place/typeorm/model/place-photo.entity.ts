import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Place } from './place.entity';

@Entity({ name: 'place_photos' })
export class PlacePhoto {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ManyToOne(() => Place, (place) => place.photos)
	place: Place;

	@Column({ type: 'varchar' })
	photoUrl: string;
}
