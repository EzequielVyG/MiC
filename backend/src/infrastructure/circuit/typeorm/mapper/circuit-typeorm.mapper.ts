import { CategoryMapper } from 'src/infrastructure/category/typeorm/mapper/category.typeorm.mapper';
import { Circuit as DomainCircuit } from '../../../../domain/circuit/model/circuit.entity';
import { PlaceMapper } from "../../../place/typeorm/mapper/place-typeorm.mapper";
import { Circuit as TypeORMCircuit } from '../model/circuit.entity';

export class CircuitMapper {
    static toDomain(circuit: TypeORMCircuit): DomainCircuit {
        return {
            id: circuit.id,
            name: circuit.name || '',
            description: circuit.description || '',
            places: circuit.places
                ? circuit.places.map((place) => PlaceMapper.toDomain(place))
                : [],
            principalCategory: circuit.principalCategory ? CategoryMapper.toDomain(circuit.principalCategory) : null,
            categories: circuit.categories ? circuit.categories.map((category) => CategoryMapper.toDomain(category))
                : [],
        };
    }

    static toTypeORM(domainCircuit: DomainCircuit): TypeORMCircuit {
        const typeORMCircuit = new TypeORMCircuit();
        typeORMCircuit.id = domainCircuit.id;
        typeORMCircuit.name = domainCircuit.name || '';
        typeORMCircuit.description = domainCircuit.description || '';
        typeORMCircuit.places = domainCircuit.places
            ? domainCircuit.places.map((place) =>
                PlaceMapper.toTypeORM(place)
            )
            : [];
        typeORMCircuit.principalCategory = domainCircuit.principalCategory ? CategoryMapper.toTypeORM(domainCircuit.principalCategory) : null
        typeORMCircuit.categories = domainCircuit.categories ? domainCircuit.categories.map((category) => CategoryMapper.toTypeORM(category)) : []
        return typeORMCircuit;
    }

}