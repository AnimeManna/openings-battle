import { create } from "zustand";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/shared/firebase";
import type { Vote } from "@/entities/votes/types";
import type { User } from "@/entities/auth/types";

interface AdminStatsState {
  allVotes: Vote[];
  allUsers: User[];
  isLoading: boolean;

  fetchAdminData: () => Promise<void>;
}

export const useAdminStatsStore = create<AdminStatsState>((set) => ({
  allVotes: [],
  allUsers: [],
  isLoading: false,

  fetchAdminData: async () => {
    set({ isLoading: true });

    try {
      const [votesSnap, usersSnap] = await Promise.all([
        getDocs(collection(db, "votes")),
        getDocs(collection(db, "users")),
      ]);

      const votes = votesSnap.docs.map((d) => d.data() as Vote);
      const users = usersSnap.docs.map(
        (d) => ({ ...d.data(), id: d.id }) as User,
      );

      set({ allVotes: votes, allUsers: users, isLoading: false });
    } catch (e) {
      console.error(e);
      set({ isLoading: false });
    }
  },
}));
