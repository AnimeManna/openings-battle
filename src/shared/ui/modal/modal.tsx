import { createPortal } from "react-dom";
import { type PropsWithChildren } from "react";
import classess from "./modal.module.scss";

const MODAL_ELEMENT_ID = "modal-root";

interface ModalProps extends PropsWithChildren {
  onClose: () => void;
}

const modalRoot = document.getElementById(MODAL_ELEMENT_ID);
export const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  if (!modalRoot) return;

  return createPortal(
    <>
      <div className={classess.blur} onClick={onClose}></div>
      <div className={classess.wrapper}>{children}</div>
    </>,
    modalRoot,
  );
};
