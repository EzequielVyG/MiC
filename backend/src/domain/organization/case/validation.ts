import { User } from 'src/domain/user/model/user.entity';
import { Document } from '../model/document.entity';
import { Organization } from '../model/organization.entity';
import { OrganizationStatus } from '../model/status.enum';

function areEqualDocuments(docs1: Document[], docs2: Document[]): boolean {
	if (docs1.length != docs2.length) return false;
	for (let i = 0; i < docs1.length; i++) {
		if (docs1[i] != docs2[2]) return false;
	}
	return true;
}

export function validateChangesByStatus(
	aOrganization: Organization,
	legalName: string,
	cuit: string,
	owner: User,
	supportingDocumentation: Document[],
): void {
	if (!aOrganization) {
		throw new Error('Organizacion inexistente');
	}

	if (
		aOrganization.status === OrganizationStatus.ACTIVE ||
		aOrganization.status === OrganizationStatus.IN_REVIEW
	) {
		if (
			aOrganization.legalName !== legalName ||
			aOrganization.cuit !== cuit ||
			!areEqualDocuments(
				aOrganization.supportingDocumentation,
				supportingDocumentation
			)) {
			throw new Error(
				'No se pueden cambiar los campos solicitados de una organización activa o en revisión'
			);
		}
	}
}
