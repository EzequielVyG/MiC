import { Query } from 'accesscontrol';

export interface iUserHasPermission {
	grantAccess(userEmail: string, action: string, resource: string | Query): Promise<boolean>;
}
