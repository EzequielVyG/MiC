import axios from 'axios';
import { URL } from '@/features/constants';

export const putEvent = async (event: FormData) => {
    const response = await axios.put(`${URL}/events`, event);
    return response.data;
};
