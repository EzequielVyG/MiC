import axios from 'axios';
import { URL } from '../../constants';

export const getAllOrganizations = async () => {
    const response = await axios.get(`${URL}/organizations`);
    return response.data;
};