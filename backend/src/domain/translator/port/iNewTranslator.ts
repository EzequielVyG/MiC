import { Translator } from "../model/translator";

export interface INewTranslator {
	save(
		entity: string,
		identificador: string,
		campo: string,
		idioma: string,
		traduccion: string): Promise<Translator>;
}
