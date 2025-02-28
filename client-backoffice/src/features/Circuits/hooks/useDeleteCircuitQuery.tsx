import axios from 'axios';
import { URL } from '@/features/constants';

export const deleteCircuit = async (id: string) => {
	const response = await axios.delete(`${URL}/circuits/id/${id}`);
	return response.data;
};