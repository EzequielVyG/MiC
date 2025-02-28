import axios from 'axios';
import { URL } from '../../constants';

export const logout = async (email: string, token: string) => {
	const body = {
		email: email,
		token: token
	};
	const response = await axios.post(`${URL}/users/logout`, body);
	return response.data;
};
