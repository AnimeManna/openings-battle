import { type ButtonHTMLAttributes, forwardRef, type ReactNode } from "react";
import clsx from "clsx";
import classess from "./button.module.scss";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: "md" | "xs";
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
      size = "md",
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={clsx(
          classess.button,
          classess[variant],
          fullWidth && classess.fullWidth,
          className,
          classess[size],
        )}
        {...props}
      >
        {isLoading ? (
          <span className={classess.spinner} aria-label="Loading" />
        ) : (
          <>
            {leftIcon && <span className={classess.icon}>{leftIcon}</span>}
            {children}
            {rightIcon && <span className={classess.icon}>{rightIcon}</span>}
          </>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
