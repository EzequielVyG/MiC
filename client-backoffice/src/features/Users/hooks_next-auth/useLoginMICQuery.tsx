import axios from 'axios';
import { URL_NEXT_AUTH } from '../../constants';

export const login = async (email: string, password: string) => {
	const body = {
		email: email,
		password: password,
	};
	const response = await axios.post(`${URL_NEXT_AUTH}/users/loginMIC`, body);
	return response.data;
};
