import { Location } from "@/features/Places/location";
import { create } from "zustand";

interface UserLocation {
    userLocation: Location | null;
    setUserLocation: (userLocation: Location | null) => void;
}

const useUserLocation = create<UserLocation>((set) => ({
    userLocation: null,
    setUserLocation: (location) => {
        set(() => ({ userLocation: location }));
    },
}));

export default useUserLocation;
