import { Circuit } from "@/features/Circuits/circuit";
import { create } from "zustand";

interface SelectedCircuit {
  selectedCircuit: Circuit | null;
  setSelectedCircuit: (circuit: Circuit | null) => void;
}

const useSelectedCircuit = create<SelectedCircuit>((set) => ({
  selectedCircuit: null,
  setSelectedCircuit: (circuit) => {
    set(() => ({ selectedCircuit: circuit }));
  },
}));

export default useSelectedCircuit;
