"use no memo";

import {
  type Column,
  type ColumnDef,
  type ColumnPinningState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import classess from "./data-grid.module.scss";
import clsx from "clsx";
import { useState, useRef, type CSSProperties } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  defaultPinnedState?: ColumnPinningState;
}

export const DataGrid = <TData, TValue>({
  columns,
  data,
  defaultPinnedState,
}: DataTableProps<TData, TValue>) => {
  const [columnPinning, setColumnPinning] = useState(
    defaultPinnedState ? defaultPinnedState : {},
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      columnPinning,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnPinningChange: setColumnPinning,
  });

  const tableContainerRef = useRef<HTMLDivElement>(null);

  const { rows } = table.getRowModel();

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 187,
    overscan: 5,
  });

  const getCommonPinningStyles = (
    column: Column<TData>,
    isHeader?: boolean,
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    const isLastLeftPinnedColumn =
      isPinned === "left" && column.getIsLastColumn("left");
    const isFirstRightPinnedColumn =
      isPinned === "right" && column.getIsFirstColumn("right");

    return {
      boxShadow: isLastLeftPinnedColumn
        ? "-4px 0 4px -4px gray inset"
        : isFirstRightPinnedColumn
          ? "4px 0 4px -4px gray inset"
          : undefined,
      left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
      right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
      top: isHeader ? 0 : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned || isHeader ? "sticky" : "relative",
      width: column.getSize(),
      zIndex: isPinned ? 10 : isHeader ? 5 : 0,
    };
  };

  return (
    <div className={classess.container}>
      <div className={classess.table} ref={tableContainerRef}>
        <div className={clsx(classess.row, classess.header)}>
          {table.getFlatHeaders().map((header) => (
            <div
              key={header.id}
              className={clsx(classess.column, classess["header__column"])}
              style={{
                width: header.getSize(),
                minWidth: header.getSize(),
                ...getCommonPinningStyles(header.column, true),
              }}
            >
              {flexRender(header.column.columnDef.header, header.getContext())}
            </div>
          ))}
        </div>
        <div
          className={classess.body}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row.id}
                className={clsx(classess.row, classess["body__row"])}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell) => (
                  <div
                    key={cell.id}
                    className={clsx(classess.column, classess["body__column"])}
                    style={{
                      width: cell.column.getSize(),
                      minWidth: cell.column.getSize(),
                      ...getCommonPinningStyles(cell.column),
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
