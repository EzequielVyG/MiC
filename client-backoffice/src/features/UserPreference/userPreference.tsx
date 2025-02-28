import { Category } from "../Categories/category";
import { User } from "../Users/user";

export interface UserPreference {
  id?: string;
  user?: User;
  categories: Category[];
  initialContext: string;
}
