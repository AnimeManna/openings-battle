import { forwardRef } from "react";
import clsx from "clsx";
import classess from "./switch.module.scss";

interface SwitchProps {
  className?: string;
  checked: boolean;
  onToggle: () => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onToggle, checked }, ref) => {
    return (
      <div className={clsx(classess.container, className)} onClick={onToggle}>
        <div className={classess.switch}>
          <input
            ref={ref}
            type="checkbox"
            className={classess.input}
            checked={checked}
          />
          <span className={classess.slider} />
        </div>
      </div>
    );
  },
);

Switch.displayName = "Switch";
