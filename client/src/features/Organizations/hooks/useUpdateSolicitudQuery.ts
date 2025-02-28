import axios from "axios";
import { URL } from "../../constants";

export const updateSolicitud = async (aOrganization: FormData) => {
  const response = await axios.put(`${URL}/organizations/`, aOrganization);
  return response.data;
};
