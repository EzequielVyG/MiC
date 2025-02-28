import { URL } from "@/features/constants";
import axios from "axios";

export const findAllNotEventCategories = async () => {
  try {
    const response = await axios.get(`${URL}/categories/notEvent`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
