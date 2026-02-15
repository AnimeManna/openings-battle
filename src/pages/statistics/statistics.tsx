import { useVotesStore } from "@/entities/votes/model/store";
import classsess from "./statistics.module.scss";

import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  PieChart,
  Pie,
} from "recharts";
import { useMemo } from "react";
import { useOpeningsStore } from "@/entities/openings/model/store";

export const StatisticsPage: React.FC = () => {
  const myVotes = useVotesStore((state) => state.votesMap);

  const openings = useOpeningsStore((state) => state.openingsMap);

  const votesSum = useMemo(
    () =>
      Array.from(myVotes.values()).reduce((sum, vote) => (sum += vote.rate), 0),
    [myVotes],
  );

  const median = useMemo(() => {
    const rates = Array.from(myVotes.values())
      .map((v) => v.rate)
      .sort((a, b) => a - b);

    const len = rates.length;
    if (len === 0) return 0;

    const mid = Math.floor(len / 2);

    if (len % 2 !== 0) {
      return rates[mid];
    }

    return (rates[mid - 1] + rates[mid]) / 2;
  }, [myVotes]);

  const data = useMemo(() => {
    const map = Array.from(myVotes.values()).reduce(
      (map, vote) => {
        const newCount = (map[vote.rate]?.count ?? 0) + 1;

        return {
          ...map,
          [vote.rate]: {
            ...map[vote.rate],
            name: vote.rate.toString(),
            count: newCount,
            percent: ((newCount / myVotes.size) * 100).toFixed(0),
          },
        };
      },
      {} as Record<number, { name: string; count: number; percent: string }>,
    );

    return Object.values(map);
  }, [myVotes]);

  const pieData = useMemo(() => {
    const array = [
      {
        label: "Оцененные",
        count: myVotes.size,
        fill: "red",
      },
    ];

    if (openings.size - myVotes.size > 0)
      array.push({
        label: "Не Оцененные",
        count: openings.size - myVotes.size,
        fill: "purple",
      });

    return array;
  }, [myVotes.size, openings]);

  return (
    <div className={classsess.container}>
      <ResponsiveContainer width="50%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <Tooltip cursor={{ fill: "transparent" }} />
          <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]}>
            <LabelList
              fill="red"
              dataKey="percent"
              formatter={(label) => `${label}%`}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <ResponsiveContainer height={400} width="50%">
        <PieChart
          accessibilityLayer
          barCategoryGap="10%"
          barGap={4}
          cx="50%"
          cy="50%"
        >
          <Pie
            width="100%"
            height="100%"
            data={pieData}
            dataKey="count"
            cx="50%"
            cy="50%"
            outerRadius="50%"
            fill="#8884d8"
          >
            <LabelList
              fill="blue"
              valueAccessor={(test) =>
                `${test.payload?.label} ${test.payload?.count}`
              }
            />
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div>Avg: {(votesSum / myVotes.size).toFixed(2)}</div>

      <div>Med: {median}</div>

      <div>Length: {myVotes.size}</div>
    </div>
  );
};
