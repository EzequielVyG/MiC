import axios from 'axios';
import { URL } from '../../constants';

export const putTakeOrganization = async (organization: any) => {
	const response = await axios.put(`${URL}/organizations/take`, organization);
	return response.data;
};
