import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import clsx from "clsx";
import s from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      fullWidth,
      isLoading,
      leftIcon,
      rightIcon,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          s.button,
          s[variant],
          fullWidth && s.fullWidth,
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <span className={s.spinner} aria-label="Loading" />
        ) : (
          <>
            {leftIcon && <span className={s.icon}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={s.icon}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
