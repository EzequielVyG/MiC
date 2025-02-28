import axios from 'axios';
import { URL } from '@/features/constants';

export const findByOrganization = async (id: string) => {
	const response = await axios.get(`${URL}/places/byOrganization/${id}`);
	return response.data;
};
