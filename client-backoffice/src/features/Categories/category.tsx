export interface Category {
  id: string;

  name: string;

  father?: Category;

  color: string;
}
