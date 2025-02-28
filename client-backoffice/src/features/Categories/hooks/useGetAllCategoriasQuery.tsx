import axios from 'axios';
import { URL } from '../../constants';

export const getAllCategorias = async () => {
	const response = await axios.get(`${URL}/categories/`);
	return response.data;
};
