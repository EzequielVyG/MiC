import axios from 'axios';
import { URL } from '../../constants';
import { User } from '../user';

export const postProviderUser = async (user: User, provider: string) => {
	const response = await axios.post(`${URL}/users/provider/${provider}`, user);
	return response.data;
};
