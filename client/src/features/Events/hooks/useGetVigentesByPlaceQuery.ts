import axios from "axios";
import { URL } from "../../constants";

export const getVigentesByPlace = async (place: string) => {
    const response = await axios.get(`${URL}/events/eventos_vigentes_place/${place}`);
    return response.data;
};