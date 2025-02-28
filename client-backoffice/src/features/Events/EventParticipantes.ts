import { Organization } from "../Organizations/Organization";

export interface EventParticipantes {
    id: string;
    organization: Organization;
    rol: string;
}