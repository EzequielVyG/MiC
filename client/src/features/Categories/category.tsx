export interface Category {
    id: string;

    name: string;

    color: string;

    father?: Category;

    group: string;
}