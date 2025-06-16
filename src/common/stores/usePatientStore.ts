import { create } from 'zustand';

interface PatientState {
  selectedPatientId: string | null; // Apenas o ID
  setSelectedPatientId: (id: string | null) => void;
}

export const usePatientStore = create<PatientState>((set) => ({
  selectedPatientId: null,
  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
}));