import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import classes from "./snackbar.module.scss";
import { useSnackbarStore } from "@/shared/model/snackbar/store";
import type { SnackbarType } from "@/shared/model/snackbar/types";
import type { IconType } from "react-icons";

import { MdCheck } from "react-icons/md";
import { IoMdInformation } from "react-icons/io";
import { MdOutlineErrorOutline } from "react-icons/md";

const snackbarVariants = {
  hidden: { y: -100, opacity: 0, scale: 0.9 },
  visible: {
    y: 20,
    opacity: 1,
    scale: 1,
  },
  exit: {
    y: -100,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const snackbarTypes: Record<SnackbarType, { icon: IconType }> = {
  success: {
    icon: MdCheck,
  },
  info: {
    icon: IoMdInformation,
  },
  error: {
    icon: MdOutlineErrorOutline,
  },
};

export const Snackbar = () => {
  const { isOpen, message, type, close } = useSnackbarStore();

  const Icon = snackbarTypes[type].icon;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`${classes.snackbar} ${classes[type]}`}
          variants={snackbarVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={close}
          role="alert"
        >
          <Icon className={classes.icon} />
          <p className={classes.message}>{message}</p>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
