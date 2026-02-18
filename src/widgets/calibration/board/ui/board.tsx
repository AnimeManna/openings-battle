import { useVotesStore } from "@/entities/votes/model/store";
import { CalibrationCard } from "@/features/calibration/ui/card/card";
import { CalibrationRow } from "@/features/calibration/ui/row/row";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useMemo } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useOpeningsStore } from "@/entities/openings/model/store";
import classess from "./board.module.scss";

const getRateId = (rate: number): string => `rate-${rate}`;
const parseRateFromId = (id: string): number =>
  parseInt(id.replace("rate-", ""), 10);

interface Data {
  id: string;
  title: string;
  list: string[];
}

const UNRATED_ROW_ID = "unrated-row";
const UNRATED_ROW_TITLE = "Неоцененные";

export const CalibrationBoard: React.FC = () => {
  const { votesMap, submitVote } = useVotesStore();
  const { openingsMap } = useOpeningsStore();

  const data = useMemo(() => {
    const rowsMap = new Map<number, string[]>();
    for (let i = 1; i <= 10; i++) {
      rowsMap.set(i, []);
    }

    const unratedList: string[] = [];

    openingsMap.forEach((opening) => {
      const vote = votesMap.get(opening.id);

      if (vote) {
        rowsMap.get(vote.rate)?.push(opening.id);
      } else {
        unratedList.push(opening.id);
      }
    });

    const result: Data[] = [];
    for (let i = 10; i >= 1; i--) {
      result.push({
        id: getRateId(i),
        title: i.toString(),
        list: rowsMap.get(i) || [],
      });
    }

    result.push({
      id: UNRATED_ROW_ID,
      title: UNRATED_ROW_TITLE,
      list: unratedList,
    });

    return result;
  }, [votesMap, openingsMap]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),

    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );

  const handleDragEnd: DragEndEvent = (event) => {
    const { operation } = event;
    const { source, target } = operation;

    if (!target || !source) return;

    if (target.id === UNRATED_ROW_ID) return;

    const openingId = source.id as string;
    const rate = parseRateFromId(target.id as string);

    if (!openingId || Number.isNaN(rate)) return;

    const voteOpening = votesMap.get(openingId);

    if (voteOpening && voteOpening.rate === rate) return;

    submitVote(openingId, rate);
  };

  return (
    <div>
      <DndContext sensors={sensors}>
        <DragDropProvider onDragEnd={handleDragEnd}>
          <div className={classess.list}>
            {data.map((data) => (
              <CalibrationRow key={data.id} id={data.id} title={data.title}>
                {data.list.map((item) => (
                  <CalibrationCard key={item} id={item} />
                ))}
              </CalibrationRow>
            ))}
          </div>
        </DragDropProvider>
      </DndContext>
    </div>
  );
};
