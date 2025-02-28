import {
	Controller,
	Get
} from '@nestjs/common';
import { responseJson } from 'src/util/responseMessage';


import { Service } from 'src/domain/place/model/service.entity';
import { FindServices } from 'src/domain/service/case/findServices.case';
import { ServiceRestMapper } from '../mapper/service-rest-mapper';
import { ServicePayload } from '../payload/service-payload';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('services')
export class ServiceController {
	constructor(
		private readonly findServices: FindServices,
	) { }

	@Get()
	async findAll(): Promise<ServicePayload[]> {
		try {
			const someServices: Service[] = await this.findServices.findAll();
			return responseJson(
				200,
				'Servicios recuperados con exito',
				someServices.map((aService) => {
					return ServiceRestMapper.toPayload(aService);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
