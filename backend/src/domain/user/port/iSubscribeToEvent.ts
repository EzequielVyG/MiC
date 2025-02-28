import { SubscribeToEventInput } from 'src/infrastructure/user/rest/input/subscribe-event.input';
import { User } from '../model/user.entity';

export interface iSubscribeToEvent {
	subscribe(userEmail: string, event: SubscribeToEventInput): Promise<User>;
	unsubscribe(userEmail: string, event: SubscribeToEventInput): Promise<User>;
}
