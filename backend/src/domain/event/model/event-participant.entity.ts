import { Organization } from 'src/domain/organization/model/organization.entity';
import { Event } from './event.entity';

export class EventParticipant {
    id: string;
    event: Event
    organization: Organization;
    role: string;
    status: string
}
