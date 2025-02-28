import axios from "axios";
import { User } from "../user";
import { URL } from "../../constants";

export const postUser = async (user: User) => {
  const response = await axios.post(`${URL}/users`, user);
  return response.data;
};
