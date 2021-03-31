import { useEffect, useRef, useState } from "react";
import * as React from "react";
import { ExerciseColor } from "../../types";
import styles from "./RepsPicker.module.css";
import SmallButton from "./SmallButton";

type Props = {
  reps: number;
  color: ExerciseColor;
  onComplete?: (completed: number) => void;
};

const RepsPicker: React.FC<Props> = ({ reps: initReps, color, onComplete }) => {
  const [reps, setReps] = useState(initReps);
  const repsRef = useRef<number>(initReps);
  useEffect(() => {
    repsRef.current = reps;
  }, [reps]);
  useEffect(
    () => () => {
      onComplete?.(repsRef.current);
    },
    [onComplete]
  );
  return (
    <div className={styles.container}>
      <SmallButton
        icon="minus"
        color={color}
        onClick={() => {
          setReps(Math.max(0, reps - 1));
        }}
        larger
      />
      <div className={styles.reps}>{reps}</div>
      <SmallButton
        icon="plus"
        color={color}
        onClick={() => {
          setReps(reps + 1);
        }}
        larger
      />
    </div>
  );
};

export default RepsPicker;
