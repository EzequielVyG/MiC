import axios from 'axios';
import { URL } from '@/features/constants';

export const postEvent = async (event: FormData) => {
    const response = await axios.post(`${URL}/events`, event);
    return response.data;
};
