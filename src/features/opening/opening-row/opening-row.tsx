import { useMemo, type ReactNode } from "react";
import { RiShieldStarFill } from "react-icons/ri";
import classess from "./opening-row.module.scss";
import type { Opening } from "../../../entities/openings/model/types";
import { useOpeningVote } from "@/entities/votes/hooks/useOpeningVote";
import { Accordion } from "@/shared/ui/accordion/accordion";
import {
  StatusRing,
  type StatusRingVariants,
} from "@/shared/ui/status-ring/status-ring";

interface OpeningRowProps {
  opening: Opening;
  isProtected?: boolean;
  children: ReactNode;
}

export const OpeningRow = ({ opening, children }: OpeningRowProps) => {
  const { rate, isProtected } = useOpeningVote(opening.id);

  const statusRingVariant: StatusRingVariants = useMemo(
    () => (isProtected ? "golden" : rate ? "surface" : "default"),
    [rate, isProtected],
  );

  return (
    <Accordion
      header={
        <div className={classess.header}>
          <div className={classess.info}>
            <p className={classess.title}>{opening.title}</p>
            <p className={classess.anime}>
              {opening.anime?.englishTitle} -- {opening.anime?.japaneseTitle} --{" "}
              {opening.anime?.russianTitle}
            </p>
          </div>

          {
            <StatusRing variant={statusRingVariant}>
              {isProtected ? (
                <RiShieldStarFill size={18} />
              ) : rate ? (
                rate
              ) : null}
            </StatusRing>
          }
        </div>
      }
    >
      {children}
    </Accordion>
  );
};
