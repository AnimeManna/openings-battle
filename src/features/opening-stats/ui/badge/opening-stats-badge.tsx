import clsx from "clsx";
import classess from "./opening-stats-badge.module.scss";
import { useMemo } from "react";

interface AdminBadgeProps {
  rate: number;
}

const rateToClassName: Record<number, string> = {
  10: classess.exellent,
  9: classess.good,
  1: classess.danger,
};

export const AdminBadge: React.FC<AdminBadgeProps> = ({ rate }) => {
  const badgeClassName = useMemo(() => rateToClassName[rate], [rate]);

  return <div className={clsx(classess.container, badgeClassName)}>{rate}</div>;
};
