
export interface IOrganizationRepository {
    create(userId: string, organizationId: string): Promise<any[]>;
}

export const IOrganizationRepository = Symbol('IOrganizationRepository');