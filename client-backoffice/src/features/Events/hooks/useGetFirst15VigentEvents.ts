import { URL } from "@/features/constants";
import axios from "axios";

export const getFirst15VigentEvents = async (
  lat: number,
  lng: number
) => {
  const response = await axios.get(`${URL}/events/eventos_vigentes_first_15`, {
    params: {
      lat: lat,
      lng: lng,
    },
  });
  return response.data;
};
