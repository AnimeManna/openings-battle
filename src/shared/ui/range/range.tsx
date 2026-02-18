import { forwardRef } from "react";
import clsx from "clsx";
import classess from "./range.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "primary" | "secondary";
}

export const Range = forwardRef<HTMLInputElement, Props>(
  ({ className, style, min = 0, max = 100, value, ...props }, ref) => {
    const currentValue = Number(value || 0);
    const minVal = Number(min);
    const maxVal = Number(max);

    const progressPercent =
      maxVal === minVal
        ? 0
        : ((currentValue - minVal) / (maxVal - minVal)) * 100;

    console.log(currentValue, value);
    return (
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        value={value}
        style={
          {
            ...style,
            "--progress": `${progressPercent}%`,
          } as React.CSSProperties
        }
        className={clsx(classess.range, className)}
        {...props}
      />
    );
  },
);

Range.displayName = "Range";
