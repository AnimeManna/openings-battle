import { useEffect, useMemo, useState } from "react";
import { useAnimeStore } from "../model/store";
import type { Option } from "@/shared/types/select";
import Fuse from "fuse.js";

export const useFilteredAnime = () => {
  const { animeMap, fetchAnime } = useAnimeStore();

  useEffect(() => {
    if (!animeMap.size) {
      fetchAnime();
    }
  }, [fetchAnime, animeMap]);

  const [animeSearch, setAnimeSearch] = useState<string>("");

  const fuse = useMemo(() => {
    const list = Array.from(animeMap.values());
    return new Fuse(list, {
      keys: [
        { name: "english_title", weight: 1 },
        { name: "russian_title", weight: 1 },
        { name: "japanese_title", weight: 0.5 },
      ],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [animeMap]);

  const filteredAnimeOptions = useMemo((): Option[] => {
    if (!animeSearch.trim()) {
      return [];
    }

    const results = fuse.search(animeSearch);

    return results
      .map((result) => result.item)
      .slice(0, 20)
      .map((anime) => ({
        label: anime.english_title,
        value: anime.id,
      }));
  }, [fuse, animeSearch]);

  return { animeSearch, setAnimeSearch, filteredAnimeOptions };
};
