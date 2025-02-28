import axios from 'axios';
import { URL } from '../../constants';

export const putUser = async (user: FormData) => {
	const response = await axios.put(`${URL}/users`, user);
	return response.data;
};
