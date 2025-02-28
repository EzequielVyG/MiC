import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Category } from '../../../category/typeorm/model/category.entity';
import { Place } from '../../../place/typeorm/model/place.entity';


@Entity({ name: 'circuits' })
export class Circuit {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'description', nullable: true })
	description: string;

	@ManyToOne(() => Category, (principalCategory) => principalCategory)
	principalCategory: Category;

	@ManyToMany(() => Category)
	@JoinTable({
		name: 'circuit_categories',
		joinColumn: {
			name: 'circuit_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'category_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	categories: Category[];

	@ManyToMany(() => Place)
	@JoinTable({
		name: 'circuit_places',
		joinColumn: {
			name: 'circuit_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'place_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	places: Place[];

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
