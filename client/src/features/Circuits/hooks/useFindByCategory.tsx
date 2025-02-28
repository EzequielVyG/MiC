import axios from 'axios';
import { URL } from '@/features/constants';

export const findByCategory = async (id: string) => {
	const response = await axios.get(`${URL}/circuits/byCategory/${id}`);
	return response.data;
};
