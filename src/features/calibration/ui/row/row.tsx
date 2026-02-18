import { useDroppable } from "@dnd-kit/react";
import classess from "./row.module.scss";
import type { PropsWithChildren } from "react";

interface CalibrationRowProps extends PropsWithChildren {
  id: string;
  title: string;
}

export const CalibrationRow: React.FC<CalibrationRowProps> = ({
  id,
  title,
  children,
}) => {
  const { isDropTarget, ref } = useDroppable({ id });

  return (
    <div
      ref={ref}
      className={classess.container}
      style={{ background: isDropTarget ? "#6366f1" : "transparent" }}
    >
      <div className={classess.titleWrapper}>
        <p className={classess.title}>{title}</p>
      </div>
      <div className={classess.list}>{children}</div>
    </div>
  );
};
