import { useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import dbService from "../../db";
import { EXERCISE_COLORS, Log } from "../../types";
import {
  isExerciseSet,
  minSecToString,
  secToMinSec,
  useWorkout,
} from "../../utils";
import LargeButton from "../inputs/LargeButton";
import RepsPicker from "../inputs/RepsPicker";
import SmallButton from "../inputs/SmallButton";
import Timer from "../inputs/Timer";
import WorkoutLog from "../WorkoutLog";
import styles from "./WorkingOut.module.css";

const WorkingOut = () => {
  const { name } = useParams<{ name: string }>();
  const history = useHistory();
  const { workout, loading } = useWorkout(name);

  const [sectionIdx, setSectionIdx] = useState(0);
  const [setIdx, setSetIdx] = useState(0);

  const [elapsed, setElapsed] = useState(0);
  const elapsedMinSec = secToMinSec(elapsed);

  const [setRepeat, setSetRepeat] = useState(1);
  const [sectionRepeat, setSectionRepeat] = useState(1);
  const [resting, setResting] = useState<
    "no" | "betweenSet" | "betweenSection" | "afterSection"
  >("no");

  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const section = workout?.sections[sectionIdx];
  const set = section?.sets[setIdx];

  const [log, setLog] = useState<Log>([]);
  const onComplete = useCallback(
    (completed: number) => {
      if (!set || !isExerciseSet(set)) {
        return;
      }
      setLog((log) => {
        const entry = log.find((e) => e.exercise.name === set.exercise.name);
        if (entry === undefined) {
          const newEntry = {
            exercise: set.exercise,
            sets: 1,
            reps: completed,
          };
          return [...log, newEntry];
        }
        return log.map((e) =>
          e.exercise.name === set.exercise.name
            ? {
                exercise: entry.exercise,
                sets: entry.sets + 1,
                reps: entry.reps + completed,
              }
            : e
        );
      });
    },
    [set]
  );

  if (loading) {
    return null;
  } else if (
    !workout ||
    ((!section || !set) && sectionIdx !== workout.sections.length)
  ) {
    return <div>Not found</div>;
  }
  const next = () => {
    if (section && set) {
      if (resting === "no") {
        if (isExerciseSet(set) && setRepeat < set.repeat) {
          if (set.restBetween) {
            setResting("betweenSet");
          } else {
            setSetRepeat(setRepeat + 1);
          }
        } else if (setIdx < section.sets.length - 1) {
          setSetIdx(setIdx + 1);
          setSetRepeat(1);
        } else if (sectionRepeat < section.repeat) {
          if (section.restBetween) {
            setResting("betweenSection");
          } else {
            setSectionRepeat(sectionRepeat + 1);
            setSetIdx(0);
          }
        } else if (section.restAfter) {
          setResting("afterSection");
        } else {
          setSectionIdx(sectionIdx + 1);
        }
      } else if (resting === "betweenSet") {
        setResting("no");
        if (isExerciseSet(set) && setRepeat < set.repeat) {
          setSetRepeat(setRepeat + 1);
        }
      } else if (resting === "betweenSection") {
        setResting("no");
        setSectionRepeat(sectionRepeat + 1);
        setSetIdx(0);
        setSetRepeat(1);
      } else if (resting === "afterSection") {
        setResting("no");
        setSectionIdx(sectionIdx + 1);
        setSectionRepeat(1);
        setSetIdx(0);
      }
    }
  };

  return (
    <div>
      <div className={styles.topContainer}>
        <div className={styles.topButton}>
          <SmallButton icon="x" flip to={`/start/preview/${workout.name}`} />
        </div>
        <div className={styles.topContent}>
          <div className={styles.workoutName}>{workout.name}</div>
          {section && <div className={styles.sectionName}>{section.name}</div>}
          <div className={styles.details}>
            {minSecToString(elapsedMinSec, "short")} elapsed
          </div>
        </div>
      </div>
      {section && set ? (
        <>
          {isExerciseSet(set) && resting === "no" ? (
            <>
              {set.exercise.method === "reps" ? (
                <RepsPicker
                  reps={set.reps}
                  color={EXERCISE_COLORS[set.exercise.type]}
                  onComplete={onComplete}
                />
              ) : (
                <Timer
                  key={0}
                  duration={set.reps}
                  color={EXERCISE_COLORS[set.exercise.type]}
                  onComplete={onComplete}
                />
              )}
              <div className={styles.exerciseName}>{set.exercise.name}</div>
            </>
          ) : (
            <>
              <Timer
                key={1}
                duration={
                  !isExerciseSet(set)
                    ? set.time
                    : resting === "betweenSet"
                    ? set.restBetween
                    : resting === "betweenSection"
                    ? section.restBetween
                    : resting === "afterSection"
                    ? section.restAfter
                    : 60
                }
                color="dark"
              />
              <div className={styles.exerciseName}>Rest</div>
            </>
          )}
          <LargeButton text="Next Step" color="dark" onClick={next} />
        </>
      ) : (
        <div>
          <div className={styles.complete}>
            Congratulations, you've completed your workout!
          </div>
          <WorkoutLog log={log} />
          <LargeButton
            text="Finish!"
            className={styles.finishButton}
            inverted
            onClick={() => {
              dbService.createLog({
                name: workout.name,
                duration: elapsed,
                date: new Date(),
                log,
              });
              history.push("/history");
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WorkingOut;
