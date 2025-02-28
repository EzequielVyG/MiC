export interface iDeleteDocument {
    delete(
        id: string,
    ): Promise<string>;
}