import { create } from "zustand";
import { persist } from 'zustand/middleware'

const useSelectedProvider = create(
  persist(
    (set) => ({
      selectedProvider: null,
      setSelectedProvider: (provider: any) => {
        set(() => ({ selectedProvider: provider }));
      }
    }),
    {
      name: 'provider-storage',
    }
  )
);

export default useSelectedProvider;
