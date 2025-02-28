import { Event } from '@/features/Events/Event';
import { URL } from '@/features/constants';
import axios from 'axios';

export const findListEvent = async (events: Event[]) => {
	try {
		const response = await axios.post(`${URL}/translators/byEvents`, events);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};