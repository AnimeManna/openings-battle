import { type ReactNode, useState } from "react";
import clsx from "clsx";
import classess from "./accordion.module.scss";

interface OpeningRowProps {
  children: ReactNode;
  header: ReactNode;
}

export const Accordion = ({ children, header }: OpeningRowProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={clsx(classess.container, isExpanded && classess.isOpen)}>
      <div
        className={classess.header}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {header}
      </div>

      <div className={clsx(classess.wrapper, isExpanded && classess.open)}>
        <div className={classess.content}>{children}</div>
      </div>
    </div>
  );
};
