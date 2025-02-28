import {
	Column,
	CreateDateColumn,
	DeleteDateColumn,
	Entity,
	JoinTable,
	ManyToMany,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Event } from '../../../event/typeorm/model/event.entity';
import { UserPreference } from './user-preference.entity';
import { UserAccount } from './userAccount.entity';
import { OrganizationUser } from '../../../organization/typeorm/model/organization-user.entity';

@Entity({ name: 'users' })
export class User {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'name' })
	name: string;

	@Column({ name: 'fechaNacimiento' })
	fechaNacimiento: Date;

	@Column({ name: 'password', nullable: true })
	password: string;

	@Column({ name: 'email' })
	email: string;

	@Column({ name: 'status' })
	status: string;

	@Column({ name: 'avatar' })
	avatar: string;

	@OneToOne(() => UserPreference, (preference) => preference.user)
	preferences: UserPreference;

	@OneToMany(() => OrganizationUser, (operator) => operator.user)
	operators: OrganizationUser[];

	@ManyToMany(() => Role)
	@JoinTable({
		name: 'user_roles',
		joinColumn: {
			name: 'user_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'role_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	roles: Role[];

	@ManyToMany(() => Event)
	@JoinTable({
		name: 'user_favorite_events',
		joinColumn: {
			name: 'user_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
		inverseJoinColumn: {
			name: 'event_id', // Debe ser el nombre de la columna en la tabla intermedia
			referencedColumnName: 'id',
		},
	})
	favoriteEvents: Event[];
	@OneToMany(() => UserAccount, (userAccount) => userAccount.user)
	accounts: UserAccount[];

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
