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

  onSelect?: (value: string) => void;
}

export const AutoComplete = forwardRef<HTMLInputElement, AutoCompleteProps>(
  ({ label, error, className, options, onSelect, value, ...props }, ref) => {
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [isFocused, setIsFocused] = useState(false);

    const selectHandler = (value: string) => {
      if (!onSelect) return;
      onSelect(value);
      setIsFocused(false);
    };

    const isOpenDropdown = useMemo(
      () => isFocused && value && options.length > 0,
      [value, options, isFocused],
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
        {isOpenDropdown ? (
          <div className={classess.options}>
            <ul className={classess.list}>
              {options.map((option) => (
                <li
                  key={option.value}
                  className={classess.item}
                  onClick={() => {
                    selectHandler(option.value);
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  },
);
