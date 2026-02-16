import { type ReactNode, useMemo, useState } from "react";
import clsx from "clsx";
import classess from "./accordion.module.scss";

interface OpeningRowProps {
  children: ReactNode;
  header: ReactNode;
  isOpenByDefault?: boolean;
  isKeepClosed?: boolean;
}

export const Accordion = ({
  children,
  header,
  isOpenByDefault = false,
  isKeepClosed = false,
}: OpeningRowProps) => {
  const [isExpanded, setIsExpanded] = useState(isOpenByDefault);

  const isOpen = useMemo(
    () => !isKeepClosed && isExpanded,
    [isKeepClosed, isExpanded],
  );

  return (
    <div className={clsx(classess.container, isOpen && classess.isOpen)}>
      <div
        className={classess.header}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {header}
      </div>

      <div className={clsx(classess.wrapper, isOpen && classess.open)}>
        <div className={classess.content}>{children}</div>
      </div>
    </div>
  );
};
