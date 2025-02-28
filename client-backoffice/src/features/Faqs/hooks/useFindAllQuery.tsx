import axios from 'axios';
import { URL } from '../../constants';

export const findAll = async () => {
	try {
		const response = await axios.get(`${URL}/faq`, {
			method: 'GET',
		});
		return response.data.data;
	} catch (error) {
		console.error('Error fetching data:', error);
	}
};
