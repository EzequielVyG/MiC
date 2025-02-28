import axios from 'axios';
import { URL_NEXT_AUTH } from '../../constants';
import { UserAccount } from '../userAccount';

export const linkAccount = async (email: string, account: UserAccount) => {
	const response = await axios.post(
		`${URL_NEXT_AUTH}/users/linkAccount/${email}`,
		account
	);
	return response.data;
};
