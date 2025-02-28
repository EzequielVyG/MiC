import axios from 'axios';
import { URL } from '@/features/constants';

export const deletePlace = async (id: string) => {
	const response = await axios.delete(`${URL}/places/id/${id}`);
	return response.data;
};