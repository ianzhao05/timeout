import { useParams } from "react-router-dom";
import { useExercise } from "../utils";
import styles from "./ExerciseInfo.module.css";
import SmallButton from "./inputs/SmallButton";
import { EXERCISE_DESCRIPTORS } from "../types";

const ExerciseInfo = () => {
  const { name } = useParams<{ name: string }>();
  const { exercise, loading } = useExercise(name);
  return (
    <div>
      <div className={styles.topContainer}>
        <SmallButton icon="arrow" flip to="/activities/exercises" />
        <div className={styles.content}>
          <div className={styles.name}>{name}</div>
          <div>
            {loading ? null : exercise === undefined ? (
              "Exercise not found"
            ) : (
              <>
                <div>
                  Type: {exercise.type && EXERCISE_DESCRIPTORS[exercise.type]}
                </div>
                <div>
                  Measured by:{" "}
                  {exercise.method &&
                    exercise.method.charAt(0).toUpperCase() +
                      exercise.method.slice(1)}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseInfo;
