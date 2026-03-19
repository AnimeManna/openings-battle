import { useMemo, useEffect } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import {
  useAdminStatsStore,
  type StatOpening,
} from "@/features/admin/model/store";

import classess from "./openings-stats.module.scss";
import { DataGrid } from "@/shared/ui/data-grid/data-grid";

type OpeningRow = StatOpening;

export const OpeningsStats = () => {
  const {
    fetchAdminData,
    rows: openings,
    columns: allUsers,
    matrix: votesMatrix,
  } = useAdminStatsStore();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const columns = useMemo<ColumnDef<OpeningRow>[]>(() => {
    if (!allUsers || !allUsers.length) return [];

    const baseColumn: ColumnDef<OpeningRow> = {
      id: "opening",
      header: "Opening Name",
      size: 600,
      cell: (info) => {
        const opening = info.row.original;
        return (
          <div className={classess.openingName} title={opening.animeTitle}>
            <span className={classess.trackName}>{opening.title}</span>{" "}
            <span className={classess.trackAnime}>{opening.animeTitle}</span>
          </div>
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
          <span className={classess.rateBadge} data-val={rate}>
            {rate}
          </span>
        ) : (
          <span className={classess.empty}>-</span>
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
  }, [allUsers, votesMatrix]);

  return (
    <div className={classess.container}>
      <DataGrid
        data={openings}
        columns={columns}
        defaultPinnedState={{ left: ["opening"], right: ["avgScore"] }}
      />
    </div>
  );
};
