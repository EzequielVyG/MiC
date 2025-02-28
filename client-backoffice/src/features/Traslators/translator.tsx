export interface Translator {
  id?: string;
  entity: string;
  identificador: string | string[] | undefined;
  campo: string;
  idioma: string;
  traduccion: string;
}
