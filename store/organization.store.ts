import { Organization } from "@/app/interfaces/user.interface";
import { create } from "zustand";

type Action = {
  updateOrgs: (orgs: State["orgs"]) => void;
};
type State = {
  orgs: Organization[];
  loading: boolean;
  refetch: null | ((params: Record<string, string | number>) => Promise<void>);
};

export const useOrgStore = create<State & Action>((set) => ({
  orgs: [],
  loading: false,
  refetch: null,
  updateOrgs: (orgs) => set({ orgs }),
}));
