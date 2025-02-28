import axios from "axios";
import { URL } from "../../constants";

export const getByFilters = async (filtersStatus: string[], organizations: string[]) => {
  const queryParams = {
    statuses: JSON.stringify(filtersStatus),
    organizations: JSON.stringify(organizations)
  };

  const response = await axios.get(`${URL}/events/filters`, {
    params: queryParams
  });

  return response.data;
}
