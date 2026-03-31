import {
  useEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type PropsWithChildren,
} from "react";
import classess from "./menu.module.scss";
import { createPortal } from "react-dom";

export type MenuProps = PropsWithChildren & {
  anchorEl: HTMLElement | null;
  open: boolean;
  handleClose?: () => void;
};

const MENU_ROOT_ID = "menu-root";

const menuRoot = document.getElementById(MENU_ROOT_ID);
export const Menu: React.FC<MenuProps> = ({
  children,
  open,
  handleClose,
  anchorEl,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        anchorEl &&
        !anchorEl.contains(target)
      ) {
        if (handleClose) handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose]);

  const menuStyle: CSSProperties | null = useMemo(() => {
    if (!anchorEl) return null;

    const anchorRect = anchorEl.getBoundingClientRect();

    const gap = 4;

    const style: CSSProperties = {
      position: "fixed",
      bottom: document.body.clientHeight - anchorRect.top + gap,
      right: document.body.clientWidth - anchorRect.right,
      zIndex: 100,
    };

    console.log(style);

    return style;
  }, [anchorEl]);

  if (!menuRoot) return;

  if (!open) return;

  return createPortal(
    <div
      className={classess.container}
      ref={containerRef}
      style={menuStyle ?? undefined}
    >
      {children}
    </div>,
    menuRoot,
  );
};
