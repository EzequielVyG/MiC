import axios from 'axios';
import { URL } from '@/features/constants';

export const findAllService = async () => {
	try {
		const response = await axios.get(`${URL}/services`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};