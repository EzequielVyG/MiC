import { Category } from "src/domain/category/model/category.entity";
import { Place } from "src/domain/place/model/place.entity";
import { Circuit } from "../model/circuit.entity";

export interface IUpdateCircuit {
        update(
                id: string,
                name: string,
                description: string,
                places: Place[],
                principalCategory: Category,
                categories: Category[]
        ): Promise<Circuit>;
}
