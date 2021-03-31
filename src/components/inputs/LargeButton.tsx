import * as React from "react";
import styles from "./LargeButton.module.css";
import { Link } from "react-router-dom";
import { IconName } from "../../types";
import Icon from "../Icon";

type Props = {
  text: string;
  className?: string;
  type?: "button" | "submit" | "reset";
  color?: "dark" | "red" | "blue";
  inverted?: boolean;
  bigText?: boolean;
  icon?: IconName;
  to?: string;
  onClick?: () => void;
  shrink?: boolean;
};

const LargeButton: React.FC<Props> = ({
  text,
  type = "button",
  color = "dark",
  inverted = false,
  bigText = false,
  shrink = false,
  icon,
  to,
  onClick,
  className = "",
}) => {
  const bcn = `${styles.button} ${
    inverted
      ? `${styles[color + "Inverted"]} ${styles.inverted}`
      : styles[color]
  } ${bigText ? styles.bigText : ""} ${
    shrink ? styles.shrink : ""
  } ${className}`;
  if (to !== undefined) {
    return (
      <Link to={to} className={bcn}>
        {icon && <Icon icon={icon} className={styles.icon} />}
        <div>{text}</div>
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} className={bcn}>
      {icon && <Icon icon={icon} className={styles.icon} />}
      <div>{text}</div>
    </button>
  );
};

export default LargeButton;
