import { URL } from '@/features/constants';
import axios from 'axios';

export const putAcceptOrganization = async (idEvent: string,idOrganization: string) => {
    const response = await axios.put(`${URL}/events/acceptOrganization/${idEvent}/${idOrganization}`);
    return response.data;
};
