import { Translator } from "../model/translator";

export interface IUpdateTranslator {
    update(
        id: string,
        entity: string,
        identificador: string,
        campo: string,
        idioma: string,
        traduccion: string): Promise<Translator>;
}
