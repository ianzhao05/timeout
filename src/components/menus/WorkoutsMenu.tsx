import styles from "./WorkoutsMenu.module.css";
import MenuLink from "./MenuLink";

const WorkoutsMenu = () => {
  return (
    <div className={styles.menu}>
      <MenuLink
        text="Workouts"
        variant="small"
        to="/activities/workouts"
        icon="activity"
      />
      <MenuLink
        text="Exercises"
        variant="small"
        to="/activities/exercises"
        icon="dumbbell"
      />
    </div>
  );
};

export default WorkoutsMenu;
