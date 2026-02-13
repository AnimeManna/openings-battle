import { Outlet } from "react-router";
import classess from "./layout.module.scss";
import { MainFooter } from "@/features/footer/footer";
import { useOpeningsStore } from "@/entities/openings/model";
import { useEffect } from "react";
import { useVotesStore } from "@/entities/votes/model";
import { useAuthStore } from "@/entities/auth/model";
import { usePlaylistStore } from "@/features/playlist/model/store";

export const Layout: React.FC = () => {
  const initOpenings = useOpeningsStore((state) => state.initSubscription);
  const initUserVotes = useVotesStore((state) => state.initVotesSubscription);
  const generatePlaylist = usePlaylistStore((state) => state.generatePlaylist);
  const openings = useOpeningsStore((state) => state.openings);
  const votes = useVotesStore((state) => state.myVotes);
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId) return;
    const unsubscribeOpenings = initOpenings();
    const unsubscribeVotes = initUserVotes(userId);

    return () => {
      unsubscribeOpenings();
      unsubscribeVotes();
    };
  }, [initOpenings, userId, initUserVotes, openings]);

  useEffect(() => {
    if (openings.length > 0 && Object.values(votes).length > 0)
      generatePlaylist(openings, votes);
  }, [openings, votes, generatePlaylist]);

  return (
    <div className={classess.container}>
      <div className={classess.outlet}>
        <Outlet />
      </div>
      <MainFooter />
    </div>
  );
};
