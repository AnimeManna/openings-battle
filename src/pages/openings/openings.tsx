import classess from "./openings.module.scss";
import { OpeningRow } from "@/features/opening/opening-row/opening-row";
import { OpeningListPreview } from "@/features/opening/opening-list-preview/opening-list-preview";
import { useOpeningsStore } from "@/entities/openings/model/store";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export const Openings: React.FC = () => {
  const { openings } = useOpeningsStore();

  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: openings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 500,
    overscan: 5,
    useFlushSync: true,
  });

  // useEffect(() => {
  //   const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();
  //   if (!lastItem) return;

  //   if (
  //     lastItem.index >= openings.length - 1 &&
  //     !isLoading &&
  //     openings.length > 0
  //   ) {
  //     fetchSortedOpenings(page + 1);
  //   }
  // }, [
  //   rowVirtualizer.getVirtualItems(),
  //   openings.length,
  //   isLoading,
  //   fetchSortedOpenings,
  //   page,
  // ]);

  return (
    <div className={classess.container}>
      <div className={classess.header}>
        <p className={classess.title}>Ваши оценки</p>
        <div className={classess.column}>
          {/* {user && (
            <Tooltip
              position="left"
              label="Щиты позволяют перенести опенинг сразу в турнирую таблицу"
            >
              <div className={classess.shields}>
                <RiShieldStarFill className={classess.icon} />
                <div className={classess.article}>
                  <p>{protectedCount}</p>
                  <p>/</p>
                  <p>{APP_CONFIG.MAX}</p>
                </div>
              </div>
            </Tooltip>
          )} */}
        </div>
      </div>
      <div className={classess.wrapper} ref={parentRef}>
        <ul
          className={classess.list}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const opening = openings[virtualRow.index];
            if (!opening) return null;

            return (
              <li
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className={classess.item}
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <OpeningRow opening={opening}>
                  <OpeningListPreview opening={opening} />
                </OpeningRow>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
