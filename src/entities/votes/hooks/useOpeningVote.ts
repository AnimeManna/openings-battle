import { useProtectionsStore } from "@/entities/protections/model/store";
import { useVotesStore } from "../model/store";
import { useMemo } from "react";

export const useOpeningVote = (openingId: string) => {
  const myVote = useVotesStore((state) => state.votesMap.get(openingId));
  const submitVote = useVotesStore((state) => state.submitVote);
  const myProtections = useProtectionsStore((state) => state.protectionsSet);
  const submitProtection = useProtectionsStore(
    (state) => state.submitProtection,
  );

  const isProtected = useMemo(
    () => myProtections.has(openingId),
    [myProtections, openingId],
  );

  const handleRate = (rate: number) => {
    submitVote(openingId, rate);
  };

  const handleProtect = async () => {
    submitProtection(openingId);
  };

  return {
    rate: myVote?.rate,
    isProtected,
    onRate: handleRate,
    onProtect: handleProtect,
  };
};
