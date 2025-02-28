import axios from 'axios';
import { URL } from '@/features/constants';

export const findByDistance = async (lat: number, lng: number) => {
	const response = await axios.get(`${URL}/places/byDistance/${lat}/${lng}`);
	return response.data;
};
