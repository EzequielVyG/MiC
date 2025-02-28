import { URL } from "@/features/constants";
import axios from "axios";
import { Translator } from "../translator";

export const updateTranslator = async (translator: Translator) => {
  const response = await axios.put(`${URL}/translators`, translator);
  return response.data;
};
