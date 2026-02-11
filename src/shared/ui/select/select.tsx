import { forwardRef, type ComponentProps } from "react";
import clsx from "clsx";
import { HiChevronDown } from "react-icons/hi2";
import classess from "./select.module.scss";

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
      <div className={clsx(classess.wrapper, className)}>
        {label && <label className={classess.label}>{label}</label>}

        <div className={classess.selectContainer}>
          <select
            ref={ref}
            className={clsx(classess.select, error && classess.hasError)}
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

          <div className={classess.icon}>
            <HiChevronDown size={18} />
          </div>
        </div>

        {error && <span className={classess.error}>{error}</span>}
      </div>
    );
  },
);
