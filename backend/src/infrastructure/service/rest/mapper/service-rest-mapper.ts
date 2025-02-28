import { Service } from "src/domain/service/model/service.entity";
import { ServicePayload } from "../payload/service-payload";

export class ServiceRestMapper {
    static toPayload(service: Service): ServicePayload {
        return {
            id: service.id,
            name: service.name,
        };
    }
}