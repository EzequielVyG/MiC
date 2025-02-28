import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Organization } from '../../organization/typeorm/model/organization.entity';
import { User } from '../../user/typeorm/model/user.entity';
import data = require('./json/organizations.json');
const normalizeEmail = require('normalize-email');

export default class OrganizationsSeeder implements Seeder {
	public async run(dataSource: DataSource): Promise<any> {
		console.log('Seeders Organization...');
		const organizationRepository = dataSource.getRepository(Organization);
		const userRepository = dataSource.getRepository(User);

		const organizationToInsert: Organization[] = await Promise.all(
			data.map(async (aOrganization) => {
				const organization = new Organization();

				organization.legalName = aOrganization.legalName;
				organization.address = aOrganization.address;
				organization.cuit = aOrganization.cuit;
				organization.cmi = aOrganization.cmi;
				organization.phone = aOrganization.phone;
				organization.status = aOrganization.status;
				const ownerUser = await userRepository.findOne({
					where: { email: aOrganization.owned.email },
				});
				organization.owner = ownerUser;

				if (aOrganization.validator) {
					const validatorUser = await userRepository.findOne({
						where: { email: normalizeEmail(aOrganization.validator.email) },
					});

					organization.validator = validatorUser;
				}

				await Promise.all(
					aOrganization.operators.map(async (aOperator: any) => {
						return await userRepository.findOne({
							where: { email: normalizeEmail(aOperator.email) },
						});
					})
				);

				return organization;
			})
		);

		const organizations = organizationRepository.create(organizationToInsert);

		await organizationRepository.save(organizations);
	}
}
