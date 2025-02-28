import axios from 'axios';
import { URL } from '../../constants';

export const putOperatorStatus = async (idOperador: any, status: string) => {
    const response = await axios.put(`${URL}/organizations/updateStatus`, { id: idOperador, status: status });
    return response.data;
};
