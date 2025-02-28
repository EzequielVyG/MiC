import { URL } from "@/features/constants";
import axios from "axios";

export const findAllEventCategories = async () => {
  try {
    const response = await axios.get(`${URL}/categories/event`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
