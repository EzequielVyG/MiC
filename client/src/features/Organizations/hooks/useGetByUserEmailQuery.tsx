import axios from 'axios';
import { URL } from '../../constants';

export const getOrganizationsByUserEmail = async (
	email: string | null | undefined
) => {
	const response = await axios.get(`${URL}/organizations/integrante/${email}`);
	return response.data;
};
