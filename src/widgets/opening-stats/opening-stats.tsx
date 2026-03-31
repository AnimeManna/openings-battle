import { useMemo, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";

import classess from "./opening-stats.module.scss";
import { DataGrid } from "@/shared/ui/data-grid/data-grid";
import {
  useOpeningStatsStore,
  type StatOpening,
} from "@/features/opening-stats/model/store";
import { AdminBadge } from "@/features/opening-stats/ui/badge/opening-stats-badge";
import { OpeningCard } from "@/entities/openings/ui/card/opening-card";
import { Button } from "@/shared/ui/button/button";
import { useNavigate } from "react-router";

type OpeningRow = StatOpening;

export const OpeningsStatsWidget: React.FC = () => {
  const {
    fetchOpeningStats: fetchAdminData,
    rows: openings,
    columns: allUsers,
    matrix: votesMatrix,
  } = useOpeningStatsStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const navigate = useNavigate();

  const columns = useMemo<ColumnDef<OpeningRow>[]>(() => {
    if (!allUsers || !allUsers.length) return [];

    const baseColumn: ColumnDef<OpeningRow> = {
      id: "opening",
      header: "Opening Name",
      size: 300,
      cell: (info) => {
        const opening = info.row.original;
        return (
          <OpeningCard
            {...opening}
            actionSlot={
              <Button
                onClick={() => {
                  navigate(`/openings/${opening.id}`);
                }}
              >
                Посмотреть
              </Button>
            }
          />
        );
      },
    };

    const userColumns: ColumnDef<OpeningRow>[] = allUsers.map((user) => ({
      id: user.id,
      header: () => (
        <div className={classess.verticalText}>{user.username}</div>
      ),

      accessorFn: (row) => votesMatrix[row.id]?.[user.id],

      cell: (info) => {
        const rate = info.getValue() as number | undefined;
        return rate ? (
          <AdminBadge rate={rate} />
        ) : (
          <div className={classess.empty}>-</div>
        );
      },
    }));

    const avgColumn: ColumnDef<OpeningRow> = {
      accessorKey: "avgScore",
      header: "AVG",
      cell: (info) => {
        const val = info.getValue() as number;
        return <div className={classess.avgCell}>{val?.toFixed(1)}</div>;
      },
    };

    return [baseColumn, ...userColumns, avgColumn];
  }, [allUsers, votesMatrix, navigate]);

  return (
    <div className={classess.container}>
      <DataGrid
        data={openings}
        columns={columns}
        defaultPinnedState={{ left: ["opening"] }}
      />
    </div>
  );
};
