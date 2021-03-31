import * as React from "react";
import styles from "./Modal.module.css";

type Props = {
  isOpen: boolean;
  close: () => void;
};

const Modal: React.FC<Props> = ({ children, isOpen }) => {
  return isOpen ? <div className={styles.modal}>{children}</div> : null;
};

export default Modal;
