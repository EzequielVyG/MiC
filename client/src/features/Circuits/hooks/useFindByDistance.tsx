import axios from 'axios';
import { URL } from '@/features/constants';

export const findByDistance = async (id: string, lat: number, lng: number) => {
	const response = await axios.get(
		`${URL}/circuits/byDistance/${id}/${lat}/${lng}`
	);
	return response.data;
};
