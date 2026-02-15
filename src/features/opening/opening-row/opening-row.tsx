import { type ReactNode, useState } from "react";
import clsx from "clsx";
import { RiShieldStarFill } from "react-icons/ri";
import classess from "./opening-row.module.scss";
import type { Opening } from "../../../entities/openings/model/types";
import { useOpeningVote } from "@/entities/votes/hooks/useOpeningVote";

interface OpeningRowProps {
  opening: Opening;
  isProtected?: boolean;
  children: ReactNode;
}

export const OpeningRow = ({ opening, children }: OpeningRowProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { rate, isProtected } = useOpeningVote(opening.id);

  const renderStatusRing = () => {
    if (isProtected) {
      return (
        <div className={clsx(classess.statusRing, classess.protected)}>
          <RiShieldStarFill size={18} />
        </div>
      );
    }
    if (rate) {
      return (
        <div className={clsx(classess.statusRing, classess.voted)}>{rate}</div>
      );
    }
    return <div className={classess.statusRing} />;
  };

  return (
    <div className={clsx(classess.row, isOpen && classess.isOpen)}>
      <div className={classess.header} onClick={() => setIsOpen(!isOpen)}>
        <div className={classess.info}>
          <p className={classess.title}>{opening.title}</p>
          <p className={classess.anime}>{opening.anime?.title}</p>
        </div>

        {renderStatusRing()}
      </div>

      <div className={clsx(classess.bodyWrapper, isOpen && classess.open)}>
        <div className={classess.bodyInner}>
          <div className={classess.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};
