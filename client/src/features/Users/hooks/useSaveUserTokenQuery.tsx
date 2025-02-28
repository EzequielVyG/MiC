import axios from 'axios';
import { URL } from '../../constants';

export const saveUserToken = async (email: string, token: string) => {
    const body = {
        email: email,
        token: token
    }
    const response = await axios.post(`${URL}/users/saveToken`, body);
    return response.data;
};
