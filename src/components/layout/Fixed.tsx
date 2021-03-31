import * as React from "react";
import styles from "./Fixed.module.css";

type Props = {
  position: "top" | "bottom" | "bottomAbove";
};

const Fixed: React.FC<Props> = ({ children, position }) => {
  return <div className={styles[position]}>{children}</div>;
};

export default Fixed;
