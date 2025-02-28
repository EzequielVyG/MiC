import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	UploadedFiles,
	UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MulterFile } from 'multer';

import { Organization } from '../../../../domain/organization/model/organization.entity';
import { UpdateTakeOrganizationInput } from '../input/update-take-organization-input';
import { OrganizationRestMapper } from '../mapper/organization-rest-mapper';
import { OrganizationPayload } from '../payload/organization-payload';

import { responseJson } from 'src/util/responseMessage';

import { CreateOrganization } from '../../../../domain/organization/case/createOrganization.case';
import { FindAllOrganization } from '../../../../domain/organization/case/findAllOrganizations.case';
import { FindByIdOrganization } from '../../../../domain/organization/case/findByIdOrganizations.case';

import { FindByOperatorOrganization } from 'src/domain/organization/case/findByOperatorOrganization.case';
import { FindByOwnerOrganization } from 'src/domain/organization/case/findByOwnerOrganization.case';
import { UpdateDropOrganization } from 'src/domain/organization/case/updateDropOrgranization.case';
import { UpdateOrganization } from 'src/domain/organization/case/updateOrganization.case';
import { UpdateStatusOrganization } from 'src/domain/organization/case/updateStatusOrgranization.case';
import { UpdateTakeOrganization } from 'src/domain/organization/case/updateTakeOrgranization.case';
import { UpdateStatusOrganizationInput } from '../input/update-status-organization-input';

import { DeleteOrganization } from 'src/domain/organization/case/deleteOrganization.case';
import { FindByIntegranteEmailOrganization } from 'src/domain/organization/case/findByIntegranteEmailOrganization';
import { FindByStatusOrganization } from 'src/domain/organization/case/findByStatusOrganizations.case';
import { FindOperator } from 'src/domain/organization/case/findOperator.case';
import { UpdateOperator } from 'src/domain/organization/case/updateOperator.case';
import { OrganizationUser } from 'src/domain/organization/model/organization-user.entity'; // import { OperatorRestMapper } from '../mapper/operator-rest-mapper';
import { CreateOrganizationInput } from '../input/create-organization-input';
import { FindByStatusesOrganizationInput } from '../input/find-by-statuses-organization-input';
import { UpdateOrganizationInput } from '../input/update-organization-input';
import { OperatorPayload } from '../payload/operator-payload';

require('dotenv').config({ path: '.env.local' }); // Esto carga las variables del .env.local

@Controller('organizations')
export class OrganizationController {
	constructor(
		private readonly createOrganization: CreateOrganization,
		private readonly updateOrganization: UpdateOrganization,
		private readonly updateTakeOrganization: UpdateTakeOrganization,
		private readonly updateDropOrganization: UpdateDropOrganization,
		private readonly updateStatusOrganization: UpdateStatusOrganization,
		private readonly findByIdOrganization: FindByIdOrganization,
		private readonly findAllOrganization: FindAllOrganization,
		private readonly findByOwnerOrganization: FindByOwnerOrganization,
		private readonly findByOperatorOrganization: FindByOperatorOrganization,
		private readonly findByIntegranteEmailOrganization: FindByIntegranteEmailOrganization,
		private readonly findByStatusOrganization: FindByStatusOrganization,
		private readonly deleteOrganization: DeleteOrganization,
		private readonly findOperator: FindOperator,
		private readonly updateOperator: UpdateOperator,
	) { }

	@Get()
	async findAll(): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findAllOrganization.findAll();
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byOwner/:ownerId')
	async findByOwner(
		@Param('ownerId') ownerId: string
	): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findByOwnerOrganization.findByOwner(ownerId);
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/byOperator/:operatorId')
	async findByOperator(
		@Param('operatorId') operatorId: string
	): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findByOperatorOrganization.findByOperator(operatorId);
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post('/byStatus')
	async findByStatus(
		@Body() organization: FindByStatusesOrganizationInput
	): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] =
				await this.findByStatusOrganization.findByStatus(organization.statuses);
			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/integrante/:email')
	async findByIntegranteEmail(
		@Param('email') email: string
	): Promise<OrganizationPayload[]> {
		try {
			const someOrganization: Organization[] = await this.findByIntegranteEmailOrganization.findByIntegranteEmail(email);

			return responseJson(
				200,
				'Organizaciones recuperadas con exito',
				someOrganization.map((aOrganization) => {
					return OrganizationRestMapper.toPayload(aOrganization);
				})
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/:id')
	async findByID(@Param('id') id: string): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.findByIdOrganization.findById(id);
			return responseJson(
				200,
				'Organizacion recuperada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Post()
	@UseInterceptors(FilesInterceptor('supportingDocumentation'))
	async submitData(
		@UploadedFiles() supportingDocumentation: MulterFile[],
		@Body() organization: CreateOrganizationInput
	) {
		try {
			const aOrganization = await this.createOrganization.create(
				organization.legalName,
				organization.address,
				organization.cuit,
				organization.principalCategory !== '' ? JSON.parse(organization.principalCategory) : null,
				organization.categories !== '' ? JSON.parse(organization.categories) : [],
				organization.cmi,
				organization.phone,
				organization.owner !== '' ? JSON.parse(organization.owner) : {},
				organization.operators !== '' ? JSON.parse(organization.operators) : [],
				supportingDocumentation,
				organization.facebook_url,
				organization.twitter_url,
				organization.instagram_url,
				organization.email,
				organization.web_organization_url,
				organization.description,
				// organization.documentDescriptions !== '' ? JSON.parse(organization.operators) : [],
			);

			const someOperators = [];
			const notExistingOperators = [];

			for (let i = 0; i < aOrganization.operators.length; i++) {
				const element = aOrganization.operators[i];
				if (element.id) {
					someOperators.push(element)
				} else {
					notExistingOperators.push(element);
				}
			}

			aOrganization.operators = someOperators;

			let message = "";

			if (notExistingOperators.length === 1) {
				message = `El operador: ${notExistingOperators[0].user.email} no cuenta con un usuario en el sistema`;
			}

			if (notExistingOperators.length > 1) {
				message = `Los operadores: `;
				for (const aOperator of notExistingOperators) {
					message += `${aOperator.user.email} `
				}
				message += ` no cuentan con un usuario en el sistema.`;
			}

			return responseJson(
				200,
				`Organizacion creada con exito. ${message}`,
				OrganizationRestMapper.toPayload(aOrganization)
			);

		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put()
	@UseInterceptors(FilesInterceptor('supportingDocumentation'))
	async update(
		@UploadedFiles() supportingDocumentation: MulterFile[],
		@Body() organization: UpdateOrganizationInput,
	) {
		try {
			const aOrganization: Organization = await this.updateOrganization.update(
				organization.id,
				organization.legalName,
				organization.address,
				organization.cuit,
				organization.principalCategory !== '' ? JSON.parse(organization.principalCategory) : null,
				organization.categories !== '' ? JSON.parse(organization.categories) : [],
				organization.cmi,
				organization.phone,
				organization.owner !== '' ? JSON.parse(organization.owner) : {},
				organization.operators !== '' ? JSON.parse(organization.operators) : [],
				supportingDocumentation,
				organization.facebook_url,
				organization.twitter_url,
				organization.instagram_url,
				organization.email,
				organization.web_organization_url,
				organization.description,
				organization.status,
				// organization.documentDescriptions !== '' ? JSON.parse(organization.operators) : [],
			);

			const someOperators = [];
			const notExistingOperators = [];

			for (let i = 0; i < aOrganization.operators.length; i++) {
				const element = aOrganization.operators[i];
				if (element.id) {
					someOperators.push(element)
				} else {
					notExistingOperators.push(element);
				}
			}

			aOrganization.operators = someOperators;

			let message = "";

			if (notExistingOperators.length === 1) {
				message = `El operador: ${notExistingOperators[0].user.email} no cuenta con un usuario en el sistema`;
			}

			if (notExistingOperators.length > 1) {
				message = `Los operadores: `;
				for (const aOperator of notExistingOperators) {
					message += `${aOperator.user.email} `
				}
				message += ` no cuentan con un usuario en el sistema.`;
			}

			return responseJson(
				200,
				`Organizacion actualizada con exito. ${message}`,
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			console.log("🚀 ~ file: organization.controller.ts:235 ~ OrganizationController ~ error:", error)
			return responseJson(500, error.message);
		}
	}

	@Put('/take')
	async updateTake(
		@Body() organization: UpdateTakeOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.updateTakeOrganization.update(
					organization.id,
					organization.validator
				);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/drop')
	async updateDrop(
		@Body() organization: UpdateTakeOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.updateDropOrganization.update(organization.id);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/status')
	async updateStatus(
		@Body() organization: UpdateStatusOrganizationInput
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization =
				await this.updateStatusOrganization.update(
					organization.id,
					organization.status,
					organization.body
				);

			return responseJson(
				200,
				'Organizacion actualizada con exito',
				OrganizationRestMapper.toPayload(aOrganization)
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Delete('/id/:id')
	async delete(@Param('id') id: string): Promise<OrganizationPayload> {
		try {
			const aOrganization: Organization = await this.deleteOrganization.delete(
				id
			);
			return aOrganization
				? responseJson(
					200,
					`${aOrganization.legalName} eliminada con exito`,
					OrganizationRestMapper.toPayload(aOrganization)
				)
				: responseJson(500, 'No existe un espacio con ese id');
		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Get('/:orgId/user/:userId')
	async findByOrgAndOperator(@Param('orgId') orgId: string, @Param('userId') userId: string): Promise<OperatorPayload> {
		try {
			const aOrganization: OrganizationUser = await this.findOperator.findByOrgAndUser(orgId, userId);
			return responseJson(
				200,
				'Organizacion recuperada con exito',
				aOrganization);

		} catch (error) {
			return responseJson(500, error.message);
		}
	}

	@Put('/updateStatus')
	async updateOperadorStatus(
		@Body() data: any
	): Promise<OrganizationPayload> {
		try {
			const aOrganization: OrganizationUser =
				await this.updateOperator.updateStatus(
					data.id,
					data.status
				);

			return responseJson(
				200,
				'Estado del operador actualizado con exito',
				aOrganization
			);
		} catch (error) {
			return responseJson(500, error.message);
		}
	}
}
