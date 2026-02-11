// src/shared/ui/NavTile/NavTile.tsx
import type { ReactNode } from "react";
import { Link } from "react-router";
import clsx from "clsx";
import classess from "./nav-tile.module.scss";

interface NavTileProps {
  to?: string;
  onClick?: () => void;
  icon: ReactNode;
  label: string;
  description?: string;
  variant?: "primary" | "secondary" | "glass";
  className?: string;
}

export const NavTile = ({
  to,
  onClick,
  icon,
  label,
  description,
  variant = "secondary",
  className,
}: NavTileProps) => {
  const content = (
    <>
      <div className={classess.iconWrapper}>{icon}</div>
      <div className={classess.textInfo}>
        <span className={classess.label}>{label}</span>
        {description && <span className={classess.desc}>{description}</span>}
      </div>
    </>
  );

  const rootClass = clsx(classess.tile, classess[variant], className);

  if (to) {
    return (
      <Link to={to} className={rootClass}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={rootClass}>
      {content}
    </button>
  );
};
