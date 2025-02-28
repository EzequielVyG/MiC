import axios from 'axios';
import { URL } from '../../constants';

export const putDropOrganization = async (organization: any) => {
	const response = await axios.put(`${URL}/organizations/drop`, organization);
	return response.data;
};
