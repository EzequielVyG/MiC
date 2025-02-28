import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	ManyToMany,
	JoinTable,
	JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Category } from '../../../category/typeorm/model/category.entity';

@Entity({ name: 'user_preferences' })
export class UserPreference {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@OneToOne(() => User, (user) => user.preferences)
	@JoinColumn({ name: 'userId' })
	user: User;

	@Column({ type: 'varchar' })
	initialContext: string;

	@ManyToMany(() => Category, { onUpdate: 'CASCADE' })
	@JoinTable({
		name: 'user_preferred_categories',
		joinColumn: {
			name: 'user_preference_id',
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'category_id',
			referencedColumnName: 'id',
		},
	})
	categories: Category[];
}
