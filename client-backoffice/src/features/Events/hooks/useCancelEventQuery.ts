import axios from 'axios';
import { URL } from '../../constants';

export const cancelEvent = async (id: string) => {
    const response = await axios.put(`${URL}/events/cancelEvent/${id}`);
    return response.data;
};
