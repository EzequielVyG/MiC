import axios from 'axios';
import { Place } from '../place';
import { URL } from '@/features/constants';

export const postPlace = async (place: Place) => {
	const response = await axios.post(`${URL}/places`, place);
	return response.data;
};