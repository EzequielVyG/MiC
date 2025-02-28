import axios from 'axios';
import { URL } from '../features/constants';

export const hasPermission = async (email: string, action: string, resource: string) => {
    const response = await axios.post(`${URL}/users/canAccess/`, { email: email, action: action, resource: resource });
    return response.data;
};