import { create } from 'zustand';

interface UserState {
  selectedUser: string;
  setUser: (id: string) => void;
}

export const useUserStore = create<UserState>((set) => ({
  selectedUser: 'U001_Frugal',
  setUser: (id) => set({ selectedUser: id }),
}));
