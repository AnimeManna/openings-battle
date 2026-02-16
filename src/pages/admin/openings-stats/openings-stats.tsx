import { useEffect } from "react";
import { useAdminStatsStore } from "@/features/admin/model/store";
import classess from "./openings-stats.module.scss";

export const OpeningsStats = () => {
  const {
    fetchAdminData,
    allOpenings: openings,
    matrix: votesMatrix,
    allProfiles: allUsers,
    isLoading,
  } = useAdminStatsStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  if (isLoading) return <div>Загружаем всю правду о судьях...</div>;

  return (
    <div className={classess.container}>
      <div className={classess.tableWrapper}>
        <table className={classess.table}>
          <thead>
            <tr className={classess.userRow}>
              <th className={classess.stickyCol}>Track / User</th>

              {allUsers.map((user) => (
                <th key={user.id} className={classess.userHeader}>
                  <div className={classess.verticalText}>{user.username}</div>
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

                    <span className={classess.trackAnime}>
                      {op.anime?.title}
                    </span>
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

                <td className={classess.avgCell}>{op.avgScore.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
