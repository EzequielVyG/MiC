import axios from 'axios';
import { URL } from '@/features/constants';

export const findAllAccessibility = async () => {
	try {
		const response = await axios.get(`${URL}/accesibilities`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};