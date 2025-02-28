import axios from 'axios';
import { URL } from '../../constants';

export const activateUser = async (id: string) => {
	const response = await axios.post(`${URL}/users/activate/${id}`);
	return response.data;
};
