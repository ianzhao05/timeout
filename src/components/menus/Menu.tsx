import * as React from "react";
import styles from "./Menu.module.css";
import MenuLink from "./MenuLink";

const Menu: React.FC = () => {
  return (
    <div className={styles.menu}>
      <MenuLink
        text="Activities"
        variant="large"
        to="/activities"
        icon="activity"
      />
      <MenuLink text="Start" variant="large" to="/start" icon="run" />
      <MenuLink text="History" variant="large" to="/history" icon="calendar" />
    </div>
  );
};

export default Menu;
