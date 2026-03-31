import clsx from "clsx";
import classess from "./status-ring.module.scss";
import type { PropsWithChildren } from "react";

export type StatusRingVariants = "default" | "golden" | "surface";

type Props = PropsWithChildren & {
  variant: StatusRingVariants;
};

export const StatusRing: React.FC<Props> = ({
  children,
  variant = "default",
}) => {
  return (
    <div className={clsx(classess.statusRing, classess[variant])}>
      {children}
    </div>
  );
};
