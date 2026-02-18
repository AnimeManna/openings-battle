import { forwardRef } from "react";
import clsx from "clsx";
import styles from "./Switch.module.scss";

interface SwitchProps {
  className?: string;
  checked: boolean;
  onToggle: () => void;
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onToggle, checked }, ref) => {
    return (
      <div className={clsx(styles.container, className)} onClick={onToggle}>
        <div className={styles.switch}>
          <input
            ref={ref}
            type="checkbox"
            className={styles.input}
            checked={checked}
          />
          <span className={styles.slider} />
        </div>
      </div>
    );
  },
);

Switch.displayName = "Switch";
