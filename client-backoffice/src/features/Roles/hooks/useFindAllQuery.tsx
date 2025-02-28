import { URL } from '@/features/constants';
import axios from 'axios';

export const findAllRoles = async () => {
	try {
		const response = await axios.get(`${URL}/users/roles`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};