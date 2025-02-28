import axios from 'axios';
import { URL } from '../../constants';

const getUsers = async () => {
	const response = await axios.get(`${URL}/users`);
	return response.data;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
	getUsers,
};
