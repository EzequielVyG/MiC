import axios from 'axios';
import { URL } from '../../constants';

export const sendPasswordTokenQuery = async (userEmail: string) => {
    const response = await axios.post(`${URL}/users/forgotMyPassword`, { email: userEmail });
    return response.data;
};
