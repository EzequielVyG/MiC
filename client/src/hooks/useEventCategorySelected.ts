import { Category } from "@/features/Categories/category";
import { create } from "zustand";

interface EventCategorySelected {
  categorySelected: Category[] | null;
  setCategorySelected: (category: Category[] | null) => void;
  firstTime: boolean;
  setFirstTime: (firstTime: boolean) => void;
}

const useEventCategorySelected = create<EventCategorySelected>((set) => ({
  firstTime: true,
  categorySelected: [],
  setCategorySelected: (category) => {
    set(() => ({ categorySelected: category }));
  },
  setFirstTime: (value) => {
    set(() => ({ firstTime: value }));
  },
}));

export default useEventCategorySelected;
