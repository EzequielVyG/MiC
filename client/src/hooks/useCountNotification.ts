import { create } from "zustand";

interface CountNotification {
    count: number;
    setCount: (count: number) => void;
}

const useCountNotificationStore = create<CountNotification>((set) => ({
    count: 0,
    setCount: (count) => {
        set(() => ({count: count}))
    }
  }));

export default useCountNotificationStore;