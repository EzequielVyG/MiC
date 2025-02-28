import axios from "axios";
import { URL } from "@/features/constants";

export const findByCategories = async (
    ids: string[],
) => {
    const response = await axios.get(`${URL}/events/byCategories`, {
        params: {
            categories: ids,
        },
    });
    return response.data;
};
