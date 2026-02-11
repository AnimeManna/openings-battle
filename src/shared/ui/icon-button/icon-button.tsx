import clsx from "clsx";
import classes from "./icon-button.module.scss";
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg" | "xl";
  isLoading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      className,
      variant = "secondary",
      size = "md",
      isLoading,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled || isLoading}
        className={clsx(
          classes.button,
          classes[variant],
          classes[size],
          className,
        )}
        {...props}
      >
        {isLoading ? <div className={classes.spinner} /> : icon}
      </button>
    );
  },
);

IconButton.displayName = "IconButton";
