import axios from "axios";
import { URL } from "../../constants";

export const getStatus = async (idEvent: string, idOrganization: string) => {
    const response = await axios.get(`${URL}/events/status/${idEvent}/${idOrganization}`);
    return response.data;
};