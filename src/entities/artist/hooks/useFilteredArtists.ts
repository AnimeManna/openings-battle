import { useEffect, useMemo, useState } from "react";
import type { Option } from "@/shared/types/select";
import Fuse from "fuse.js";
import { useArtistStore } from "../model/store";

export const useFilteredArtists = () => {
  const { artistMap, fetchArtists } = useArtistStore();

  useEffect(() => {
    if (!artistMap.size) {
      fetchArtists();
    }
  }, [fetchArtists, artistMap]);

  const [artistSearch, setArtistSearch] = useState<string>("");

  const fuse = useMemo(() => {
    const list = Array.from(artistMap.values());
    return new Fuse(list, {
      keys: [{ name: "name", weight: 1 }],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [artistMap]);

  const filtereArtistsOptions = useMemo((): Option[] => {
    if (!artistSearch.trim()) {
      return [];
    }

    const results = fuse.search(artistSearch);

    return results
      .map((result) => result.item)
      .slice(0, 20)
      .map((artist) => ({
        label: artist.name,
        value: artist.id,
      }));
  }, [fuse, artistSearch]);

  return {
    artistSearch,
    setArtistSearch,
    filtereArtistsOptions,
  };
};
