import { Outlet } from "react-router";
import classess from "./layout.module.scss";
import { MainFooter } from "@/features/footer/footer";
import { useOpeningsStore } from "@/entities/openings/model/store";
import { useEffect } from "react";
import { useVotesStore } from "@/entities/votes/model/store";
import { useAuthStore } from "@/entities/auth/model/store";
import { Snackbar } from "@/shared/ui/shackbar/snackbar";
import { useProtectionsStore } from "@/entities/protections/model/store";
import { useStageStore } from "@/entities/stage/model/store";
import { useRoundsStore } from "@/entities/rounds/model/store";

export const Layout: React.FC = () => {
  const fetchSortedOpenings = useOpeningsStore(
    (state) => state.fetchSortedOpenings,
  );
  const fetchVotes = useVotesStore((state) => state.fetchVotes);
  const fetchProtections = useProtectionsStore(
    (state) => state.fetchProtections,
  );
  const userId = useAuthStore((state) => state.user?.id);

  const fetchStages = useStageStore((state) => state.fetchStages);

  const stagesMap = useStageStore((state) => state.stagesMap);

  const fetchRounds = useRoundsStore((state) => state.fetchRounds);

  useEffect(() => {
    if (!userId) return;
    fetchVotes(userId);
    fetchSortedOpenings(1);
    fetchProtections();
    fetchStages();
  }, [fetchSortedOpenings, fetchVotes, fetchProtections, fetchStages, userId]);

  useEffect(() => {
    if (stagesMap.size && userId) {
      const lastActiveStage = Array.from(stagesMap.values()).find(
        (stage) => stage.status === "active",
      );
      if (lastActiveStage) {
        fetchRounds(userId, lastActiveStage.id);
      }
    }
  }, [stagesMap, userId, fetchRounds]);

  return (
    <div className={classess.container}>
      <Snackbar />
      <div className={classess.outlet}>
        <Outlet />
      </div>
      <div className={classess.toolbar}></div>
      <MainFooter />
    </div>
  );
};
