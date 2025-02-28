import axios from 'axios';
import { URL_NEXT_AUTH } from '../../constants';

export const getUserByProvider = async (
	email: string,
	provider: string,
	accountID: string
) => {
	const response = await axios.post(`${URL_NEXT_AUTH}/users/provider/find`, {
		email,
		provider,
		accountID,
	});
	return response.data;
};
