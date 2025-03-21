import axios from 'axios';
import { URL } from '@/features/constants';

export const findCircuitById = async (id: string) => {
	try {
		const response = await axios.get(`${URL}/circuits/id/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};