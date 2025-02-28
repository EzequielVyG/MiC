import axios from 'axios';
import { URL } from '../../constants';

export const getuserByEmail = async (email: string) => {
	const response = await axios.get(`${URL}/users/email/${email}`);
	return response.data;
};
