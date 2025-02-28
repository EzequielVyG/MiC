import axios from 'axios';
import { URL } from '../../constants';

export const getOperatorComplete = async (organizationId: string, userId: string) => {
    const response = await axios.get(`${URL}/organizations/${organizationId}/user/${userId}`);
    return response.data;
};
