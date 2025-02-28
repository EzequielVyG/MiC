import { Place } from "@/features/Places/place";
import { create } from "zustand";

interface PlaceList {
    placeList: Place[]
    setPlaceList: (placeList: Place[]) => void;
}

const usePlaceList = create<PlaceList>((set) => ({
    placeList: [],
    setPlaceList: (placeList) => {
        set(() => ({ placeList: placeList }));
    },
}));

export default usePlaceList;
