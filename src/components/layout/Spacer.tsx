import * as React from "react";
import styles from "./Spacer.module.css";

type Props = {
  type: "top" | "topMenu" | "bottom" | "bottomAbove";
};

const Spacer: React.FC<Props> = ({ type }) => {
  return <div className={styles[type]}>&nbsp;</div>;
};

export default Spacer;
