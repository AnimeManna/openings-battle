import { forwardRef, useMemo, useRef, useState } from "react";
import classess from "./autocomplete.module.scss";
import type { Option } from "@/shared/types/select";
import clsx from "clsx";

interface AutoCompleteProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onSelect"
> {
  label?: string;
  error?: string;
  options: Option[];

  noOptionsContent?: React.ReactNode;

  onSelect?: (value: string, label: string) => void;
}

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  ({ label, error, className, options, onSelect, value, ...props }, ref) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isFocused, setIsFocused] = useState(false);

    const selectHandler = (value: string, label: string) => {
      if (!onSelect) return;
      onSelect(value, label);
      setIsFocused(false);
    };

    const isOpenDropdown = useMemo(
      () => isFocused && value,
      [value, isFocused],
    );

    const focusHandler = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setIsFocused(true);
    };

    const blurHandler = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setIsFocused(false), 200);
    };

    return (
      <div
        className={clsx(classess.container, className, {
          [classess.active]: isOpenDropdown,
        })}
      >
        {label && <label className={classess.label}>{label}</label>}

        <div className={classess.inputContainer}>
          <input
            ref={ref}
            className={clsx(classess.input, error && classess.hasError)}
            autoComplete="off"
            value={value}
            onFocus={focusHandler}
            onBlur={blurHandler}
            {...props}
          />
        </div>

        {error && <p className={classess.error}>{error}</p>}
        {isOpenDropdown && (
          <div className={classess.options}>
            {options.length > 0 ? (
              <ul className={classess.list}>
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={classess.item}
                    onClick={() => {
                      selectHandler(option.value, option.label);
                    }}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            ) : (
              <div className={classess.noOptions}>
                {props.noOptionsContent || (
                  <div className={classess.empty}>Ничего не найдено</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    );
  },
);
