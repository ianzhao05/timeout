import * as React from "react";
import { IconName } from "../../types";
import { NavLink } from "react-router-dom";
import styles from "./MenuLink.module.css";
import Icon from "../Icon";

type Props = {
  to: string;
  variant: "small" | "large";
  text: string;
  icon: IconName;
};

const MenuLink: React.FC<Props> = ({ to, variant, text, icon }) => {
  return (
    <NavLink
      to={to}
      className={variant === "small" ? styles.smallLink : styles.largeLink}
      activeClassName={
        variant === "small" ? styles.smallSelected : styles.largeSelected
      }
      exact={false}
    >
      <Icon
        icon={icon}
        className={variant === "small" ? styles.smallIcon : styles.largeIcon}
      />
      <div>{text}</div>
    </NavLink>
  );
};

export default MenuLink;
