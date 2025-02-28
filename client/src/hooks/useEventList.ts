import { Event } from "@/features/Events/Event";
import { create } from "zustand";

interface EventList {
    eventList: Event[]
    setEventList: (eventList: Event[]) => void;
}

const useEventList = create<EventList>((set) => ({
    eventList: [],
    setEventList: (eventList) => {
        set(() => ({ eventList: eventList }));
    },
}));

export default useEventList;
