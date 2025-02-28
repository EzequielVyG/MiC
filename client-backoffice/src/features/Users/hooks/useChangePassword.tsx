import axios from 'axios';
import { URL } from '../../constants';

export const changePassword = async (email: string, user: any) => {
	const response = await axios.put(`${URL}/users/${email}`, user);
	return response.data;
};
