import axios from "axios";
import { URL } from "../../constants";

export const deleteSolicitud = async (id: string) => {
  const response = await axios.delete(`${URL}/organizations/id/${id}`);
  return response.data;
};
