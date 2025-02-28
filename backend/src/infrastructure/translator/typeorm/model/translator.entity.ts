import {
	Column,
	Entity,
	PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'translators' })
export class Translator {
	@Column({ name: 'id' })
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'entity' })
	entity: string;

	@Column({ name: 'identificador' })
	identificador: string;

	@Column({ name: 'campo' })
	campo: string;

	@Column({ name: 'idioma' })
	idioma: string;

	@Column({ name: 'traduccion' })
	traduccion: string;
}
