
import { Service as DomainService } from 'src/domain/place/model/service.entity';
import { Service as TypeORMService } from 'src/infrastructure/place/typeorm/model/service.entity';

export class ServiceMapper {
	static toDomain(service: TypeORMService): DomainService {
		return {
			id: service.id,
			name: service.name || null,
		};
	}

	static toTypeORM(domainService: DomainService): TypeORMService {
		const typeORMService = new TypeORMService();
		typeORMService.id = domainService.id;
		typeORMService.name = domainService.name || null;
		return typeORMService;
	}	
}
