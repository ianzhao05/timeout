import * as React from "react";
import { Workout } from "../types";
import {
  isExerciseSet,
  pluralize,
  secToMinSec,
  minSecToString,
} from "../utils";
import styles from "./WorkoutPreview.module.css";

type Props = {
  workout: Workout;
};

const formatSec = (sec: number): string =>
  minSecToString(secToMinSec(sec), "long");

const WorkoutPreview: React.FC<Props> = ({ workout }) => {
  return (
    <div>
      {workout.sections.map((section) => (
        <div key={section.id} className={styles.section}>
          <div className={styles.sectionInfo}>
            <div className={styles.sectionName}>{section.name}</div>
            <div className={styles.sectionDetails}>
              {section.repeat} {pluralize(section.repeat, "cycle")}
              {section.restBetween > 0 &&
                `, ${formatSec(section.restBetween)} rest between`}
              {section.restAfter > 0 &&
                `, ${formatSec(section.restAfter)} rest after`}
            </div>
          </div>
          {section.sets.map((set) =>
            isExerciseSet(set) ? (
              <div
                className={`${styles.set} ${styles[set.exercise.type]}`}
                key={set.id}
              >
                <div className={styles.setName}>{set.exercise.name}</div>
                <div className={styles.setInfo}>
                  <div>
                    {set.repeat} {pluralize(set.repeat, "set")}
                  </div>
                  <div>
                    {set.exercise.method === "reps"
                      ? `${set.reps} ${pluralize(set.reps, "rep")}`
                      : set.reps === 0
                      ? "Stopwatch"
                      : formatSec(set.reps)}
                  </div>
                  {set.repeat > 1 && (
                    <div>{formatSec(set.restBetween)} rest</div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${styles.set} ${styles.rest}`} key={set.id}>
                <div className={styles.setName}>Rest</div>
                <div className={styles.setInfo}>{formatSec(set.time)}</div>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default WorkoutPreview;
