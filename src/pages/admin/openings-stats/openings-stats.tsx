import classess from "./openings-stats.module.scss";
import { OpeningsStatsWidget } from "@/widgets/opening-stats/opening-stats";

export const AdminOpeningStats: React.FC = () => {
  return (
    <div className={classess.container}>
      <OpeningsStatsWidget />
    </div>
  );
};
