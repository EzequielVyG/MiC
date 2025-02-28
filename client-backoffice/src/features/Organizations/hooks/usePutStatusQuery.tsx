import axios from 'axios';
import { URL } from '../../constants';

export const putStatusOrganization = async (id: string, status: string, textEmail: string|null) => {
	const body = {
		id: id,
		status: status,
		body: textEmail
	}
	const response = await axios.put(`${URL}/organizations/status`, body);
	return response.data;
};
