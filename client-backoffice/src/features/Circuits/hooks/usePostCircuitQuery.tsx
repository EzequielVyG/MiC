import axios from 'axios';
import { URL } from '@/features/constants';
import { Circuit } from '../circuit';

export const postCircuit = async (circuit: Circuit) => {
	const response = await axios.post(`${URL}/circuits`, circuit);
	return response.data;
};