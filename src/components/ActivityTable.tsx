import * as React from "react";
import styles from "./ActivityTable.module.css";
import { Exercise, ExerciseType, IconName, Workout } from "../types";
import Icon from "./Icon";
import { Link } from "react-router-dom";

type RowProps = {
  text: string;
  type: ExerciseType | "workout";
  onClick?: () => void;
  to?: string;
  icon: IconName;
};

const Row: React.FC<RowProps> = ({ text, type, onClick, icon, to }) => {
  const inner = (
    <li className={`${styles.row} ${styles[type]}`} onClick={onClick}>
      <div>{text}</div>
      <Icon className={styles.icon} icon={icon} />
    </li>
  );
  return to ? (
    <Link to={to} className={styles.link}>
      {inner}
    </Link>
  ) : (
    inner
  );
};

type PropsExercise = {
  data: Exercise[];
  icon: IconName;
  onClick?: (ex: Exercise) => () => void;
  to?: (ex: Exercise) => string;
};

type PropsWorkout = {
  data: Workout[];
  icon: IconName;
  onClick?: (wo: Workout) => () => void;
  to?: (ex: Workout) => string;
};

type Props = PropsExercise | PropsWorkout;

const isExerciseProps = (props: Props): props is PropsExercise => {
  return "type" in props.data[0];
};

const ActivityTable: React.FC<Props> = (props) => {
  if (props.data.length === 0) {
    return <div className={styles.none}>No activities yet!</div>;
  }

  if (isExerciseProps(props)) {
    return (
      <ul className={styles.container}>
        {props.data.map((ex) => (
          <Row
            text={ex.name}
            key={ex.name}
            type={ex.type}
            onClick={props.onClick && props.onClick(ex)}
            to={props.to && props.to(ex)}
            icon={props.icon}
          />
        ))}
      </ul>
    );
  } else {
    return (
      <ul className={styles.container}>
        {props.data.map((wo) => (
          <Row
            text={wo.name}
            key={wo.name}
            type="workout"
            onClick={props.onClick && props.onClick(wo)}
            to={props.to && props.to(wo)}
            icon={props.icon}
          />
        ))}
      </ul>
    );
  }
};

export default ActivityTable;
