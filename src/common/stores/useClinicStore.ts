import { create } from 'zustand';

interface ClinicState {
  selectedClinicId: string | null; // Apenas o ID
  setSelectedClinicId: (id: string | null) => void;
}

export const useClinicStore = create<ClinicState>((set) => ({
  selectedClinicId: null,
  setSelectedClinicId: (id) => set({ selectedClinicId: id }),
}));