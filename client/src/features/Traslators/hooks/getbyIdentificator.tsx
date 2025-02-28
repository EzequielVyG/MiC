import { URL } from "@/features/constants";
import axios from "axios";

export const findByIdentificador = async (id: string, entityType: string) => {
  try {
    const response = await axios.get(
      `${URL}/translators/byEntity/${entityType}/byIdentificator/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
