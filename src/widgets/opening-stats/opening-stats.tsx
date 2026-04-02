import { useMemo, useEffect, useState, useDeferredValue } from "react";
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
import { TextField } from "@/shared/ui/text-field/textfield";
import Fuse from "fuse.js";
import { Select } from "@/shared/ui/select/select";

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
      header: "Opening",
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

  const [openingSearch, setOpeningSearch] = useState<string>("");

  const deferredSearch = useDeferredValue(openingSearch);

  const fuse = useMemo(() => {
    const flatData = openings.map((op) => ({
      ...op,
      _searchString: `${op.title} ${op.anime?.englishTitle} ${op.anime?.japaneseTitle} ${op.artists?.map((a) => a.name).join(" ")}`,
    }));
    return new Fuse(Array.from(flatData), {
      keys: ["_searchString"],
      threshold: 0.3,
      ignoreLocation: true,
    });
  }, [openings]);

  const filteredOpenings = useMemo((): StatOpening[] => {
    if (!deferredSearch.trim()) {
      return openings;
    }
    const results = fuse.search(deferredSearch);
    return results.map((result) => result.item);
  }, [fuse, deferredSearch, openings]);

  return (
    <div className={classess.container}>
      <div className={classess.filters}>
        <TextField
          label="Поиск"
          placeholder="Название аниме, трека, исполнителя"
          value={openingSearch}
          onChange={(e) => setOpeningSearch(e.currentTarget.value)}
        />
      </div>
      <div className={classess.table}>
        <DataGrid
          data={filteredOpenings}
          columns={columns}
          defaultPinnedState={{ left: ["opening"] }}
        />
      </div>
    </div>
  );
};
