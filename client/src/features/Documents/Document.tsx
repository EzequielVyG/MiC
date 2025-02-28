import { Organization } from "../Organizations/Organization";

export interface Document {
    id?: string;
    name: string;
    url: string; 
    organization: Organization;
}