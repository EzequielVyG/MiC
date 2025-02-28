import { URL } from '@/features/constants';
import axios from 'axios';

export const findAllEvents = async () => {
	try {
		const response = await axios.get(`${URL}/events`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};