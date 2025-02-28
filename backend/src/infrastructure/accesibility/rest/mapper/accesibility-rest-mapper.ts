import { Accesibility } from "../../typeorm/model/accesibility.entity";
import { AccesibilityPayload } from "../payload/accesibility-payload";

export class AccesibilityRestMapper {
    static toPayload(accesibility: Accesibility): AccesibilityPayload {
        return {
            id: accesibility.id,
            name: accesibility.name,
        };
    }
}