import type { PropsWithChildren } from "react";
import classess from "./badge.module.scss";

type BadgeProps = PropsWithChildren;

export const Badge: React.FC<BadgeProps> = ({ children }) => {
  return <div className={classess.container}>{children}</div>;
};
