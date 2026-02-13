import { create } from "zustand";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/shared/firebase";
import type { Opening, OpeningMap } from "./types";
interface OpeningsState {
  openings: Opening[];
  isLoading: boolean;
  isInitialized: boolean;
  openingsMap: OpeningMap;
  initSubscription: () => () => void;
  setOpeningsMap: (newOpeningMap: OpeningMap) => void;
}

export const useOpeningsStore = create<OpeningsState>((set, get) => ({
  openings: [],
  isLoading: true,
  isInitialized: false,
  openingsMap: {},

  initSubscription: () => {
    if (get().isInitialized) return () => {};

    const q = query(collection(db, "openings"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Opening[];

      set({
        openings: data,
        isLoading: false,
        isInitialized: true,
      });
    });

    return unsubscribe;
  },
  setOpeningsMap: (newOpeningsMap: OpeningMap) => {
    set({ openingsMap: { ...get().openingsMap, ...newOpeningsMap } });
  },
}));
