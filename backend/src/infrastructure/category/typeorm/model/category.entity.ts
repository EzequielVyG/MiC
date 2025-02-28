import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
	DeleteDateColumn,
	JoinColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

	@ManyToOne(() => Category, { nullable: true })
	@JoinColumn({ name: 'father' })
	father: Category;

	@Column({ name: 'group' })
	group: string;

	@Column({ name: 'color'})
	color: string;

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
