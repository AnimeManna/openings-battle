import { type ReactNode, useState } from "react";
import clsx from "clsx";
import classess from "./tooltip.module.scss";

interface TooltipProps {
  label: string | ReactNode;
  children: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
  delay?: number;
}

export const Tooltip = ({
  label,
  children,
  position = "top",
  className,
}: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);

  if (!label) return <>{children}</>;

  return (
    <div
      className={clsx(classess.wrapper, className)}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}

      <div
        role="tooltip"
        className={clsx(
          classess.tooltip,
          classess[position],
          isVisible && classess.visible,
        )}
      >
        {label}
      </div>
    </div>
  );
};
