import axios from "axios";
import { URL } from "../../constants";

export const getVigentes = async () => {
    const response = await axios.get(`${URL}/events/vigentes`);
    return response.data;
};