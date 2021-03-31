import * as React from "react";
import { Link } from "react-router-dom";
import styles from "./SmallButton.module.css";
import { ExerciseColor, IconName } from "../../types";
import Icon from "../Icon";

type Props = {
  to?: string;
  onClick?: () => void;
  color?: "light" | "dark" | ExerciseColor;
  icon: IconName;
  larger?: boolean;
  flip?: boolean;
};

const SmallButton: React.FC<Props> = ({
  to,
  onClick,
  icon,
  color = "light",
  larger = false,
  flip = false,
}) => {
  const bcn = `${larger ? styles.buttonLarger : styles.button} ${
    styles[color]
  }`;
  const icn = flip ? styles.iconFlipped : styles.icon;
  if (to !== undefined) {
    return (
      <Link to={to} className={bcn}>
        <Icon icon={icon} className={icn} />
      </Link>
    );
  }
  return (
    <button type="button" onClick={onClick} className={bcn}>
      <Icon icon={icon} className={icn} />
    </button>
  );
};

export default SmallButton;
