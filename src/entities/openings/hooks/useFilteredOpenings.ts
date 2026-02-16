import { useEffect, useMemo, useState } from "react";
import Fuse from "fuse.js";
import { useOpeningsStore } from "../model/store";
import type { Opening } from "../model/types";

export const useFilteredOpenings = () => {
  const { openingsMap, fetchSortedOpenings } = useOpeningsStore();

  useEffect(() => {
    if (!openingsMap.size) {
      fetchSortedOpenings(1);
    }
  }, [fetchSortedOpenings, openingsMap]);

  const [openingSearch, setOpeningSearch] = useState<string>("");

  const fuse = useMemo(() => {
    return new Fuse(Array.from(openingsMap.values()), {
      keys: [
        { name: "title", weight: 1 },
        { name: "anime.title", weight: 1 },
        { name: "artists.name", weight: 0.8 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [openingsMap]);

  const filteredOpenings = useMemo((): Opening[] => {
    if (!openingSearch.trim()) {
      return Array.from(openingsMap.values());
    }

    const results = fuse.search(openingSearch);

    return results.map((result) => result.item);
  }, [fuse, openingSearch, openingsMap]);

  return {
    openingSearch,
    setOpeningSearch,
    filteredOpenings,
  };
};
