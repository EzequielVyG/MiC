import axios from 'axios';
import { URL } from '../../constants';
import { Event } from '@/features/Events/Event';

export const subscribeEvent = async (userEmail: string, event: Event) => {
	const response = await axios.put(
		`${URL}/users/subscribeToEvent/${userEmail}`,
		{
			event,
		}
	);
	return response.data;
};

export const unsubscribeEvent = async (userEmail: string, event: Event) => {
	const response = await axios.put(
		`${URL}/users/unsubscribeToEvent/${userEmail}`,
		{
			event,
		}
	);
	return response.data;
};
