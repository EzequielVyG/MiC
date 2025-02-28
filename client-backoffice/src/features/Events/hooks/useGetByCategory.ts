import axios from 'axios';
import { URL } from '../../constants';

export const getByCategory = async (categoryId: string) => {
    const response = await axios.get(`${URL}/events/category/${categoryId}`);
    return response.data;
};
