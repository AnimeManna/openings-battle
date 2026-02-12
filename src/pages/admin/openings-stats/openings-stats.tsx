import { useEffect, useMemo } from "react";
import { useAdminStatsStore } from "@/features/admin/model";
import { useOpeningsStore } from "@/entities/openings/model";
import classess from "./openings-stats.module.scss";

export const OpeningsStats = () => {
  const { fetchAdminData, allVotes, allUsers, isLoading } =
    useAdminStatsStore();
  const { openings } = useOpeningsStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const votesMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};

    allVotes.forEach((vote) => {
      if (!matrix[vote.openingId]) {
        matrix[vote.openingId] = {};
      }
      matrix[vote.openingId][vote.userId] = vote.rate;
    });

    return matrix;
  }, [allVotes]);

  if (isLoading) return <div>Загружаем всю правду о судьях...</div>;

  return (
    <div className={classess.container}>
      <div className={classess.tableWrapper}>
        <table className={classess.table}>
          <thead>
            <tr>
              <th className={classess.stickyCol}>Track / User</th>

              {allUsers.map((user) => (
                <th key={user.id} className={classess.userHeader}>
                  <div className={classess.verticalText}>
                    {user.displayName}
                  </div>
                </th>
              ))}

              <th>AVG</th>
            </tr>
          </thead>

          <tbody>
            {openings.map((op) => (
              <tr key={op.id}>
                <td className={classess.stickyCol} title={op.title}>
                  <div className={classess.trackInfo}>
                    <span className={classess.trackName}>{op.title}</span>
                    <span className={classess.trackAnime}>{op.anime}</span>
                  </div>
                </td>

                {allUsers.map((user) => {
                  const rate = votesMatrix[op.id]?.[user.id];

                  return (
                    <td key={user.id} className={classess.cell}>
                      {rate ? (
                        <span className={classess.rateBadge} data-val={rate}>
                          {rate}
                        </span>
                      ) : (
                        <span className={classess.empty}>-</span>
                      )}
                    </td>
                  );
                })}

                <td className={classess.avgCell}>
                  {op.stats.avgScore.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
