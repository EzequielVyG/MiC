import axios from 'axios';
import { URL } from '@/features/constants';

export const postPlace = async (place: FormData) => {
	const response = await axios.post(`${URL}/places`, place);
	return response.data;
};