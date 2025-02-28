import axios from 'axios';
import { URL } from '@/features/constants';

export const findAll = async (userId: string) => {
    try {
		const response = await axios.get(`${URL}/notifications/notRead/user/${userId}`);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};