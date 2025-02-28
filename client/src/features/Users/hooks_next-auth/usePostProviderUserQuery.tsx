import axios from 'axios';
import { User } from '../user';
import { URL_NEXT_AUTH } from '../../constants';

export const postProviderUser = async (user: User, provider: string) => {
	const response = await axios.post(
		`${URL_NEXT_AUTH}/users/provider/${provider}`,
		user
	);
	return response.data;
};
