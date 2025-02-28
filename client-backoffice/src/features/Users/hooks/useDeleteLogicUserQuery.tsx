import { URL } from '@/features/constants';
import axios from 'axios';

export const deleteLogicUser = async (id: string) => {
	const response = await axios.delete(`${URL}/users/id/${id}`);
	return response.data;
};