import { URL } from "@/features/constants";
import axios from "axios";
import { Translator } from "../translator";

export const createTranslator = async (translator: Translator) => {
  const response = await axios.post(`${URL}/translators`, translator);
  return response.data;
};
