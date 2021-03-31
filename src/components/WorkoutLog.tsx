import * as React from "react";
import { Log } from "../types";
import { minSecToString, pluralize, secToMinSec } from "../utils";
import styles from "./WorkoutLog.module.css";

type Props = {
  log: Log;
};

const WorkoutLog: React.FC<Props> = ({ log }) => {
  return (
    <div>
      {log.map((entry, i) => (
        <div
          key={i}
          className={`${styles.entry} ${styles[entry.exercise.type]}`}
        >
          <div className={styles.exercise}>{entry.exercise.name}</div>
          <div className={styles.entryInfo}>
            <div>
              {entry.sets} {pluralize(entry.sets, "set")}
            </div>
            <div>
              {entry.exercise.method === "time"
                ? minSecToString(secToMinSec(entry.reps), "long")
                : `${entry.reps} ${pluralize(entry.reps, "rep")}`}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WorkoutLog;
