import { create } from "zustand";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/shared/firebase";
import type { Opening } from "./types";

interface OpeningsState {
  openings: Opening[];
  openingsMap: Record<string, Opening>;
  isLoading: boolean;
  isInitialized: boolean;

  initSubscription: () => () => void;
}

export const useOpeningsStore = create<OpeningsState>((set, get) => ({
  openings: [],
  openingsMap: {},
  isLoading: true,
  isInitialized: false,

  initSubscription: () => {
    if (get().isInitialized) return () => {};

    const q = query(collection(db, "openings"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Opening[];

      const openingsMap = data.reduce(
        (map, opening) => ({ ...map, [opening.id]: opening }),
        {},
      );

      set({
        openings: data,
        isLoading: false,
        isInitialized: true,
        openingsMap,
      });
    });

    return unsubscribe;
  },
}));
