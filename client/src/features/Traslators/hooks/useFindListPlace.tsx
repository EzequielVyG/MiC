import { Place } from '@/features/Places/place';
import { URL } from '@/features/constants';
import axios from 'axios';

export const findListPlace = async (places: Place[]) => {
	try {
		const response = await axios.post(`${URL}/translators/byPlaces`, places);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};