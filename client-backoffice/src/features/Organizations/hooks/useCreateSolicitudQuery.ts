import axios from 'axios';
import { URL } from '../../constants';

export const createSolicitud = async (aOrganization: FormData) => {
    const response = await axios.post(`${URL}/organizations/`, aOrganization);
    return response.data;
};