import axios from 'axios';
import { URL } from '../../constants';

export const getCategoriasByParent = async (name: string | null) => {
	const response = await axios.post(`${URL}/categories/father`, {
		name: name,
	});
	return response.data;
};
