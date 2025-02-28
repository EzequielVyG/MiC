import axios from 'axios';
import { URL } from '@/features/constants';

export const findAllWithEvents = async () => {
    try {
        const response = await axios.get(`${URL}/places/withEvents`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};