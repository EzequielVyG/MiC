import { Organization } from "./organization";

export interface Document {
    id?: string;
    name: string;
    url: string; 
    organization: Organization;
}