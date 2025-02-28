import axios from 'axios';
import { URL } from '../../constants';

export const getUserById = async (id: string) => {
	const response = await axios.get(`${URL}/users/id/${id}`);
	return response.data;
};
