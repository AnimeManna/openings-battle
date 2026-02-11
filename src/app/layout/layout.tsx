import { Outlet } from "react-router";
import classess from "./layout.module.scss";
import { MainFooter } from "@/features/footer/footer";
import { useOpeningsStore } from "@/entities/openings/model";
import { useEffect } from "react";
import { useVotesStore } from "@/entities/votes/model";
import { useAuthStore } from "@/entities/auth/model";

export const Layout: React.FC = () => {
  const initOpenings = useOpeningsStore((state) => state.initSubscription);
  const initUserVotes = useVotesStore((state) => state.initVotesSubscription);
  const userId = useAuthStore((state) => state.user?.id);

  useEffect(() => {
    if (!userId) return;
    const unsubscribeOpenings = initOpenings();
    const unsubscribeVotes = initUserVotes(userId);

    return () => {
      unsubscribeOpenings();
      unsubscribeVotes();
    };
  }, [initOpenings, userId, initUserVotes]);

  return (
    <div className={classess.container}>
      <div className={classess.outlet}>
        <Outlet />
      </div>
      <MainFooter />
    </div>
  );
};
