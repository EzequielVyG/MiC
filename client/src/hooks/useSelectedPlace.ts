import { Place } from "@/features/Places/place";
import { create } from "zustand";

interface SelectedPlace {
  selectedPlace: Place | null;
  setSelectedPlace: (category: Place | null) => void;
}

const useSelectedPlace = create<SelectedPlace>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => {
    set(() => ({ selectedPlace: place }));
  },
}));

export default useSelectedPlace;
