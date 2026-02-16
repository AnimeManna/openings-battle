import classess from "./openings.module.scss";
import { OpeningRow } from "@/features/opening/opening-row/opening-row";
import { OpeningListPreview } from "@/features/opening/opening-list-preview/opening-list-preview";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";
import { TextField } from "@/shared/ui/text-field/textfield";
import { useFilteredOpenings } from "@/entities/openings/hooks/useFilteredOpenings";

export const Openings: React.FC = () => {
  const parentRef = useRef<HTMLDivElement>(null);

  const { openingSearch, setOpeningSearch, filteredOpenings } =
    useFilteredOpenings();

  const rowVirtualizer = useVirtualizer({
    count: filteredOpenings.length,
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

      <TextField
        label="Поиск"
        placeholder="Название аниме, трека, исполнителя"
        value={openingSearch}
        onChange={(e) => setOpeningSearch(e.currentTarget.value)}
      />
      <div className={classess.wrapper} ref={parentRef}>
        <ul
          className={classess.list}
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const opening = filteredOpenings[virtualRow.index];
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
