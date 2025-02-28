import axios from 'axios';
import { URL } from '@/features/constants';

export const putPlace = async (place: FormData) => {
	const response = await axios.put(`${URL}/places`, place);
	return response.data;
};
