import axios from 'axios';
import { URL } from '../../constants';

export const getUsers = async () => {
	const response = await axios.get(`${URL}/users`);
	return response.data;
};
