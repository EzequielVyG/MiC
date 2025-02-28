import axios from "axios";
import { URL } from "@/features/constants";

export const findByCategory = async (id: string, lat: number, lng: number) => {
  const response = await axios.get(`${URL}/places/byCategory/${id}`, {
    params: {
      lat: lat,
      lng: lng,
    },
  });
  return response.data;
};
