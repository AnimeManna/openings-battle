import { useVotesStore } from "@/entities/votes/model/store";
import classsess from "./statistics.module.scss";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  YAxis,
  CartesianGrid,
  type TooltipContentProps,
} from "recharts";
import { useMemo } from "react";
import { useOpeningsStore } from "@/entities/openings/model/store";
import { motion } from "framer-motion";
import type { ValueType } from "recharts/types/component/DefaultTooltipContent";

const PIE_COLORS = ["#8b5cf6", "#3f3f46"];

const CustomTooltip = ({
  active,
  payload,
  label,
}: TooltipContentProps<ValueType, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className={classsess.customTooltip}>
        <p>{label ? `Оценка ${label}` : payload[0].name}</p>
        <p style={{ color: payload[0].fill }}>Количество: {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

export const StatisticsPage: React.FC = () => {
  const myVotes = useVotesStore((state) => state.votesMap);
  const openings = useOpeningsStore((state) => state.openingsMap);

  const votesSum = useMemo(
    () =>
      Array.from(myVotes.values()).reduce((sum, vote) => (sum += vote.rate), 0),
    [myVotes],
  );

  const average = myVotes.size > 0 ? (votesSum / myVotes.size).toFixed(2) : 0;

  const median = useMemo(() => {
    const rates = Array.from(myVotes.values())
      .map((v) => v.rate)
      .sort((a, b) => a - b);

    const length = rates.length;
    if (length === 0) return 0;

    const mid = Math.floor(length / 2);
    if (length % 2 !== 0) return rates[mid];
    return (rates[mid - 1] + rates[mid]) / 2;
  }, [myVotes]);

  const barData = useMemo(() => {
    const distribution = Array.from({ length: 10 }, (_, i) => i + 1).map(
      (score) => {
        const count = Array.from(myVotes.values()).filter(
          (vote) => vote.rate === score,
        ).length;

        return {
          name: score.toString(),
          count: count,
          opacity: count > 0 ? 1 : 0.3,
        };
      },
    );
    return distribution;
  }, [myVotes]);

  const pieData = useMemo(() => {
    return [
      { name: "Оценено", value: myVotes.size },
      { name: "Осталось", value: openings.size - myVotes.size },
    ];
  }, [myVotes.size, openings.size]);

  return (
    <div className={classsess.container}>
      <motion.div
        className={classsess.header}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2>Ваша статистика</h2>
      </motion.div>

      {/* Верхний ряд: Цифры */}
      <div className={classsess.statsGrid}>
        <motion.div
          className={classsess.statCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className={classsess.label}>Всего оценок</p>
          <p className={classsess.value}>{myVotes.size}</p>
        </motion.div>

        <motion.div
          className={classsess.statCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className={classsess.label}>Средний балл</p>
          <p className={classsess.value}>{average}</p>
        </motion.div>

        <motion.div
          className={classsess.statCard}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <p className={classsess.label}>Медиана</p>
          <p className={classsess.value}>{median}</p>
        </motion.div>
      </div>

      <div className={classsess.chartsGrid}>
        <motion.div
          className={classsess.chartCard}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <p className={classsess.chartTitle}>Распределение оценок</p>
          <BarChart
            responsive
            style={{ flex: 1, aspectRatio: 16 / 7.5 }}
            data={barData}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis
              dataKey="name"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.5)" }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: "rgba(255,255,255,0.5)" }}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              content={CustomTooltip}
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
            />
            <Bar
              dataKey="count"
              fill="url(#colorCount)"
              radius={[6, 6, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </motion.div>

        <motion.div
          className={classsess.chartCard}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <p className={classsess.chartTitle}>Прогресс</p>
          <PieChart
            responsive
            style={{ width: "100%", height: "100%", aspectRatio: 1 }}
          >
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {pieData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={PIE_COLORS[index % PIE_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={CustomTooltip} />
          </PieChart>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              marginTop: "-20px",
            }}
          >
            {pieData.map((entry, index) => (
              <div
                key={entry.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                <div
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: PIE_COLORS[index],
                  }}
                />
                {entry.name} ({((entry.value / openings.size) * 100).toFixed(0)}
                %)
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};
