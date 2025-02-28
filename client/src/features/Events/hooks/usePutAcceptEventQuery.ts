import axios from 'axios';
import { URL } from '@/features/constants';

export const putAcceptEvent = async (id: string) => {
    const response = await axios.put(`${URL}/events/acceptEvent/${id}`);
    return response.data;
};
