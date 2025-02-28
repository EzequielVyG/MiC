import axios from "axios";
import { URL } from "@/features/constants";

export const findByCategories = async (
  ids: string[],
  lat: number,
  lng: number
) => {
  const response = await axios.get(`${URL}/places/byCategories`, {
    params: {
      categories: ids,
      lat: lat,
      lng: lng,
    },
  });
  return response.data;
};
