// entities/player/model/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Source = "main" | "backup";

interface PlayerState {
  volume: number;
  isMuted: boolean;
  videoSource: Source;
  isSpoilerProof: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setSource: (source: Source) => void;
  setIsSpoilerProof: () => void;
  isCustomPlayer: boolean;
  toggleIsCustomPlayer: () => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set) => ({
      volume: 0.5,
      isMuted: false,
      videoSource: "main",
      isSpoilerProof: false,
      isCustomPlayer: true,
      setVolume: (volume) => set({ volume: volume, isMuted: volume === 0 }),
      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
      setSource: (source) => set({ videoSource: source }),
      toggleIsCustomPlayer: () => {
        console.log("toggle");
        set((state) => ({ isCustomPlayer: !state.isCustomPlayer }));
      },
      setIsSpoilerProof: () =>
        set((state) => ({ isSpoilerProof: !state.isSpoilerProof })),
    }),

    { name: "player-settings" },
  ),
);
