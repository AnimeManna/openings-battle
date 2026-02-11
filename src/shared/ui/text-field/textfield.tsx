import { forwardRef } from "react";
import styles from "./textfield.module.scss";
import clsx from "clsx";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={clsx(styles.wrapper, className)}>
        {label && <label className={styles.label}>{label}</label>}

        <div className={styles.inputContainer}>
          <input
            ref={ref}
            className={clsx(styles.input, error && styles.hasError)}
            autoComplete="off"
            {...props}
          />
        </div>

        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  },
);
