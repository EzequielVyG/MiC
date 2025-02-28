import { Role as TypeORMRole } from '../model/role.entity';
import { Role as DomainRole } from '../../../../domain/user/model/role.entity';  // Asegúrate de importar la ubicación correcta

export class RoleMapper {

    static toDomain(role: TypeORMRole): DomainRole {
        return {
            id: role.id,
            name: role.name
        };
    }

    static toTypeORM(domainRole: DomainRole): TypeORMRole {
        const typeORMRole = new TypeORMRole();
        typeORMRole.id = domainRole.id;
        typeORMRole.name = domainRole.name;

        return typeORMRole;
    }
}
