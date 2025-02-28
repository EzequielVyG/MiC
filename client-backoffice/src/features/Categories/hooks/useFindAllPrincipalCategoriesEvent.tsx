import { URL } from '@/features/constants';
import axios from 'axios';

export const findAllPrincipalCategoriesEvent = async () => {
	try {
		const response = await axios.get(
			`${URL}/categories/events/principalCategories`
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};
