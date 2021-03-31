import * as React from "react";
import { Exercise } from "../../types";
import AllExercises from "../AllExercises";
import styles from "./ExerciseSelect.module.css";
import Icon from "../Icon";

type Props = {
  close: () => void;
  onSelect: (ex: Exercise) => void;
};

const ExerciseSelect: React.FC<Props> = ({ close, onSelect }) => {
  const onClick = (ex: Exercise) => () => {
    close();
    onSelect(ex);
  };
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        Select Exercise
        <div className={styles.icon} onClick={close}>
          <Icon icon="x" />
        </div>
      </div>
      <div className={styles.content}>
        <AllExercises onClick={onClick} small />
      </div>
    </div>
  );
};

export default ExerciseSelect;
