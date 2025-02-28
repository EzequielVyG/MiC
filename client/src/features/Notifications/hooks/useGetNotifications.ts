import axios from 'axios';
import { URL } from '@/features/constants';

export const findAll = async (email: string) => {
    try {
		const response = await axios.get(`${URL}/notifications/user/${email}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};