import axios from 'axios';
import { URL } from '@/features/constants';

export const putRejectEvent = async (id: string, message: string) => {
    const body = {
        reason: message
    }
    const response = await axios.put(`${URL}/events/rejectEvent/${id}`, body);
    return response.data;
};
