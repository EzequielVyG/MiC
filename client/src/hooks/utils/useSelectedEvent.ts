import { Event } from "@/features/Events/Event";
import { create } from "zustand";

interface SelectedEvent {
  selectedEvent: Event | null;
  setSelectedEvent: (event: Event | null) => void;
}

const useSelectedEvent = create<SelectedEvent>((set) => ({
  selectedEvent: null,
  setSelectedEvent: (place) => {
    set(() => ({ selectedEvent: place }));
  },
}));

export default useSelectedEvent;
