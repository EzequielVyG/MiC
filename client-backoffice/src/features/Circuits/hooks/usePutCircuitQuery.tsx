import axios from 'axios';
import { URL } from '@/features/constants';
import { Circuit } from '../circuit';

export const putCircuit = async (circuit: Circuit) => {
	const response = await axios.put(`${URL}/circuits`, circuit);
	return response.data;
};
