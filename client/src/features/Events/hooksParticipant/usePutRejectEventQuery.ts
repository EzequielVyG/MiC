import { URL } from '@/features/constants';
import axios from 'axios';

export const putRejectOrganization = async (idEvent: string, idOrganization: string, message: string) => {
    const body = {
        reason: message
    }
    const response = await axios.put(`${URL}/events/rejectOrganization/${idEvent}/${idOrganization}`, body);
    return response.data;
};
