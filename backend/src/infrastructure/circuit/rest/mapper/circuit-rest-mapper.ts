import { Circuit } from "src/domain/circuit/model/circuit.entity";
import { CircuitPayload } from "../payload/circuit-payload";
import { CategoryRestMapper } from "src/infrastructure/category/rest/mapper/category-rest-mapper";

export class CircuitRestMapper {
    static toPayload(circuit: Circuit): CircuitPayload {
        return {
            id: circuit.id,
            name: circuit.name,
            description: circuit.description,
            places: circuit.places,
            principalCategory: circuit.principalCategory ? CategoryRestMapper.toPayload(circuit.principalCategory) : null,
            categories: circuit.categories
                ? circuit.categories.map((category) =>
                    CategoryRestMapper.toPayload(category)
                )
                : [],
        };
    }
}