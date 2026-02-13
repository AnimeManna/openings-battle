import type { Opening } from "@/entities/openings/types";
import type { Vote } from "@/entities/votes/types";
import { create } from "zustand";

interface PlaylistStore {
  playlistMap: Record<string, Opening>;
  playlist: Opening[];
  nextOpening: Opening | null;
  generatePlaylist: (openings: Opening[], votes: Record<string, Vote>) => void;
}

export const usePlaylistStore = create<PlaylistStore>((set, get) => ({
  playlistMap: {},
  playlist: [],
  nextOpening: null,

  generatePlaylist: (openings, votes) => {
    const sortedOpenings = [...openings].sort((a, b) => {
      const voteA = votes[a.id];
      const voteB = votes[b.id];

      const isRatedA = !!voteA;
      const isRatedB = !!voteB;

      if (!isRatedA && isRatedB) return -1;
      if (isRatedA && !isRatedB) return 1;

      if (!isRatedA && !isRatedB) {
        return (a.orderNumber || 0) - (b.orderNumber || 0);
      }

      const isProtectedA = voteA?.isProtected || false;
      const isProtectedB = voteB?.isProtected || false;

      if (isProtectedA && !isProtectedB) return -1;
      if (!isProtectedA && isProtectedB) return 1;

      const rateA = voteA?.rate || 0;
      const rateB = voteB?.rate || 0;

      return rateB - rateA;
    });

    const copyMap = get().playlistMap;

    sortedOpenings.forEach((opening) => {
      copyMap[opening.id] = opening;
    });

    const playlist = Object.values(copyMap);

    const nextOpening = sortedOpenings[0];

    set({ playlistMap: copyMap, playlist, nextOpening });
  },
}));
