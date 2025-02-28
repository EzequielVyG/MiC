import { User } from '@/features/Users/user';
import { Organization } from './organization';

export interface OrganizationOperator {
    id?: string;
    user: User;
    status: string;
    organization: Organization;
}