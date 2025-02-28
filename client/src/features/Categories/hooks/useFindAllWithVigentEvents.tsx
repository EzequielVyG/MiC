import { URL } from "@/features/constants";
import axios from "axios";

export const findAllCategoriesWithVigentEvents = async () => {
  try {
    const response = await axios.get(`${URL}/categories/withVigentEvents`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
