import * as React from "react";
import { useAllWorkouts } from "../utils";
import { IconName, Workout } from "../types";
import ActivityTable from "./ActivityTable";

type Props = {
  onClick?: (wo: Workout) => () => void;
  to?: (wo: Workout) => string;
  icon: IconName;
};

const AllWorkouts: React.FC<Props> = ({ onClick, to, icon }) => {
  const { allWorkouts, loading } = useAllWorkouts();
  return (
    <div>
      {loading || !allWorkouts ? null : (
        <ActivityTable
          data={allWorkouts}
          onClick={onClick}
          to={to}
          icon={icon}
        />
      )}
    </div>
  );
};

export default AllWorkouts;
