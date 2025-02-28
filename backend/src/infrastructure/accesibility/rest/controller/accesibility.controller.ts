import {
	Controller,
	Get
} from '@nestjs/common';
import { FindAccesibilities } from 'src/domain/accesibility/case/findAccesibilities.case';
import { responseJson } from 'src/util/responseMessage';
import { Accesibility } from '../../typeorm/model/accesibility.entity';
import { AccesibilityRestMapper } from '../mapper/accesibility-rest-mapper';
import { AccesibilityPayload } from '../payload/accesibility-payload';


require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('accesibilities')
export class AccesibilityController {
	constructor(
		private readonly findAccesibilities: FindAccesibilities,
	) { }

	@Get()
	async findAll(): Promise<AccesibilityPayload[]> {
		try {
			const someAccesibilities: Accesibility[] = await this.findAccesibilities.findAll();
			return responseJson(
				200,
				'Accesibilidades recuperadas con exito',
				someAccesibilities.map((aAccesibility) => {
					return AccesibilityRestMapper.toPayload(aAccesibility);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
