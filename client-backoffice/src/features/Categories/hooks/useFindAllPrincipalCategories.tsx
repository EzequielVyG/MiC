import { URL } from "@/features/constants";
import axios from "axios";

export const findAllPrincipalCategories = async () => {
  try {
    const response = await axios.get(`${URL}/categories/principalCategories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
