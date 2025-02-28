import axios from 'axios';
import { URL } from '@/features/constants';

export const markAllRead = async (userId: string) => {
    try {
		const response = await axios.put(`${URL}/notifications/readAll/user/${userId}`);
		return response;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
	
};