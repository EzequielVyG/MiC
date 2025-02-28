import { URL } from "@/features/constants";
import axios from "axios";

export const findAllByDistance = async (
  lat: number,
  lng: number
) => {
  const response = await axios.get(`${URL}/places/findAllByDistance`, {
    params: {
      lat: lat,
      lng: lng,
    },
  });
  return response.data;
};
