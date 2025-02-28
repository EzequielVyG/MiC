import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'accessibilities' })
export class Accesibility {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

}
