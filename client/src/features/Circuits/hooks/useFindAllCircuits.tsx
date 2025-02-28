import axios from "axios";
import { URL } from "@/features/constants";

export const findAllCircuits = async () => {
  try {
    const response = await axios.get(`${URL}/circuits`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
