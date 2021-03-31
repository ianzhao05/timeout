import { useParams } from "react-router-dom";
import { useWorkout } from "../../utils";
import WorkoutForm from "./WorkoutForm";

const WorkoutEdit = () => {
  const { name } = useParams<{ name: string }>();
  const { workout, loading } = useWorkout(name);

  return loading ? null : workout === undefined ? (
    <div>Workout not found</div>
  ) : (
    <WorkoutForm values={workout} />
  );
};

export default WorkoutEdit;
