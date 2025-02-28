import axios from 'axios';
import { URL } from '../../constants';

export const getAll = async () => {
    const response = await axios.get(`${URL}/organizations`);
    return response.data;
};