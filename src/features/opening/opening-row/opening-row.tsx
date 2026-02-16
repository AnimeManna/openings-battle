import { type ReactNode } from "react";
import clsx from "clsx";
import { RiShieldStarFill } from "react-icons/ri";
import classess from "./opening-row.module.scss";
import type { Opening } from "../../../entities/openings/model/types";
import { useOpeningVote } from "@/entities/votes/hooks/useOpeningVote";
import { Accordion } from "@/shared/ui/accordion/accordion";

interface OpeningRowProps {
  opening: Opening;
  isProtected?: boolean;
  children: ReactNode;
}

export const OpeningRow = ({ opening, children }: OpeningRowProps) => {
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
    <Accordion
      header={
        <div className={classess.header}>
          <div className={classess.info}>
            <p className={classess.title}>{opening.title}</p>
            <p className={classess.anime}>{opening.anime?.title}</p>
          </div>

          {renderStatusRing()}
        </div>
      }
    >
      {children}
    </Accordion>
  );
};
