import axios from "axios";
import { URL } from "../../constants";

export const getByOwner = async (ownerId: string) => {
  const response = await axios.get(`${URL}/organizations/byOwner/${ownerId}`);
  return response.data;
};
