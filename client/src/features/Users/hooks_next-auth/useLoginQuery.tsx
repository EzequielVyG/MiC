import axios from 'axios';
import { URL_NEXT_AUTH } from '../../constants';

export const login = async (email: string, password: string, token: string) => {
	const body = {
		email: email,
		password: password,
		token: token,
	};
	const response = await axios.post(`${URL_NEXT_AUTH}/users/login`, body);
	return response.data;
};
