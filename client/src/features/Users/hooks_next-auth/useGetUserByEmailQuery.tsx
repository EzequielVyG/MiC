import axios from 'axios';
import { URL_NEXT_AUTH } from '../../constants';

export const getuserByEmail = async (email: string) => {
	const response = await axios.get(`${URL_NEXT_AUTH}/users/email/${email}`);
	return response.data;
};
