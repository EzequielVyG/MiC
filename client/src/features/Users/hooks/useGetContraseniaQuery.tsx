import axios from "axios";
import { URL } from "../../constants";

export const getByContrasenia = async (email: string) => {
  const response = await axios.get(`${URL}/users/findByContrasenia/${email}`);
  return response.data;
};
