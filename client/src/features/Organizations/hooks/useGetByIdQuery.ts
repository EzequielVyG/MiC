import axios from 'axios';
import { URL } from '../../constants';

export const getById = async (id: string) => {
    const response = await axios.get(`${URL}/organizations/${id}`);
    return response.data;
};
