
import { Accessibility as DomainAccesibility } from 'src/domain/place/model/accesibility.entity';
import { Accessibility as TypeORMAccesibility } from 'src/infrastructure/place/typeorm/model/accesibility.entity';

export class AccesibilityMapper {
	static toDomain(accesibility: TypeORMAccesibility): DomainAccesibility {
		return {
			id: accesibility.id,
			name: accesibility.name || null,
		};
	}

	static toTypeORM(domainAccesibility: DomainAccesibility): TypeORMAccesibility {
		const typeORMAccesibility = new TypeORMAccesibility();
		typeORMAccesibility.id = domainAccesibility.id;
		typeORMAccesibility.name = domainAccesibility.name || null;
		return typeORMAccesibility;
	}	
}
