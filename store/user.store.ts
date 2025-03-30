import { User, CreatedUser } from "@/app/interfaces/user.interface";
import { create } from "zustand";

type Action = {
  updateUser: (user: State["user"]) => void;
};
type State = {
  user: User;
  loading: boolean;
  refetch: null | ((params: Record<string, string | number>) => Promise<void>);
};

export const useUserStore = create<State & Action>((set) => ({
  user: {
    name: "",
    email: "",
    avatar: "",
    isActive: true,
    $id: "",
    createdUsers: [],
    transactions: [],
  },
  loading: false,
  refetch: null,
  updateUser: (user) => set({ user }),
}));
