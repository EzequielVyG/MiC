import axios from 'axios';
import { URL } from '@/features/constants';

export const findById = async (id: string) => {
	try {
		const response = await axios.get(`${URL}/places/id/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};