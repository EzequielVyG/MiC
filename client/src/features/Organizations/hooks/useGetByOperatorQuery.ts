import axios from "axios";
import { URL } from "../../constants";

export const getByOperator = async (ownerId: string) => {
    const response = await axios.get(`${URL}/organizations/byOperator/${ownerId}`);
    return response.data;
};
