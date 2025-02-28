import axios from "axios";
import { URL } from "../../constants";

export const getByStatus = async (status: string[]) => {
    const response = await axios.post(`${URL}/organizations/byStatus`, { statuses: status });
    return response.data;
};
