import axios from 'axios';
import { URL } from '../../constants';

export const deleteEvent = async (id: string) => {
    const response = await axios.delete(`${URL}/events/id/${id}`);
    return response.data;
};
