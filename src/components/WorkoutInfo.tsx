import { useParams } from "react-router-dom";
import { useWorkout } from "../utils";
import styles from "./WorkoutInfo.module.css";
import SmallButton from "./inputs/SmallButton";
import WorkoutPreview from "./WorkoutPreview";
import LargeButton from "./inputs/LargeButton";
import Fixed from "./layout/Fixed";
import Spacer from "./layout/Spacer";

const WorkoutInfo = () => {
  const { name } = useParams<{ name: string }>();
  const { workout, loading } = useWorkout(name);
  return (
    <div>
      <div className={styles.topContainer}>
        <div className={styles.topButton}>
          <SmallButton icon="arrow" flip to="/start" />
        </div>
        <div className={styles.topContent}>
          <div className={styles.name}>{name}</div>
          <div className={styles.details}>
            {loading ? null : workout === undefined ? (
              "Workout not found"
            ) : (
              <>
                {workout.sections.length} section
                {workout.sections.length !== 1 && "s"}
              </>
            )}
          </div>
        </div>
      </div>
      {!loading && workout !== undefined && (
        <>
          <WorkoutPreview workout={workout} />
          <LargeButton
            text="Edit this workout"
            to={`/activities/workouts/edit/${workout.name}`}
            icon="pencil"
            className={styles.editButton}
          />
          <Fixed position="bottomAbove">
            <LargeButton
              text="Start!"
              color="blue"
              inverted
              bigText
              to={`/start/workout/${workout.name}`}
            />
          </Fixed>
        </>
      )}
      <Spacer type="bottom" />
    </div>
  );
};

export default WorkoutInfo;
