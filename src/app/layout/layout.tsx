import { Outlet } from "react-router";
import classess from "./layout.module.scss";
import { MainFooter } from "@/features/footer/footer";
import { useOpeningsStore } from "@/entities/openings/model/store";
import { useEffect } from "react";
import { useVotesStore } from "@/entities/votes/model/store";
import { useAuthStore } from "@/entities/auth/model/store";
import { Snackbar } from "@/shared/ui/shackbar/snackbar";
import { useProtectionsStore } from "@/entities/protections/model/store";

export const Layout: React.FC = () => {
  const fetchSortedOpenings = useOpeningsStore(
    (state) => state.fetchSortedOpenings,
  );
  const fetchVotes = useVotesStore((state) => state.fetchVotes);
  const fetchProtections = useProtectionsStore(
    (state) => state.fetchProtections,
  );
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId) return;
    fetchVotes(userId);
    fetchSortedOpenings(1);
    fetchProtections();
  }, [fetchSortedOpenings, fetchVotes, fetchProtections, userId]);

  return (
    <div className={classess.container}>
      <Snackbar />
      <div className={classess.outlet}>
        <Outlet />
      </div>
      <MainFooter />
    </div>
  );
};
