import { URL } from "@/features/constants";
import axios from "axios";

export const findAllCategoriesWithPlaces = async () => {
  try {
    const response = await axios.get(`${URL}/categories/withPlaces`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
