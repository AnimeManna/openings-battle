import { forwardRef, type ComponentProps } from "react";
import clsx from "clsx";
import { HiChevronDown } from "react-icons/hi2";
import s from "./Select.module.scss";

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends ComponentProps<"select"> {
  label?: string;
  error?: string;
  options?: SelectOption[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, className, options, children, placeholder, ...props },
    ref,
  ) => {
    return (
      <div className={clsx(s.wrapper, className)}>
        {label && <label className={s.label}>{label}</label>}

        <div className={s.selectContainer}>
          <select
            ref={ref}
            className={clsx(s.select, error && s.hasError)}
            {...props}
          >
            {placeholder && (
              <option value="" disabled selected hidden>
                {placeholder}
              </option>
            )}

            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}

            {!options && children}
          </select>

          <div className={s.icon}>
            <HiChevronDown size={18} />
          </div>
        </div>

        {error && <span className={s.error}>{error}</span>}
      </div>
    );
  },
);
