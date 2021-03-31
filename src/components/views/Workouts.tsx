import * as React from "react";
import Fixed from "../layout/Fixed";
import LargeButton from "../inputs/LargeButton";
import Spacer from "../layout/Spacer";
import AllWorkouts from "../AllWorkouts";

type Props = {
  url: string;
};

const Workouts: React.FC<Props> = ({ url }) => {
  return (
    <>
      <AllWorkouts
        to={(wo) => `${url}/workouts/edit/${wo.name}`}
        icon="pencil"
      />
      <Spacer type="bottomAbove" />
      <Fixed position="bottomAbove">
        <LargeButton
          text="New Workout"
          color="blue"
          icon="plus"
          to={`${url}/workouts/new`}
        />
      </Fixed>
    </>
  );
};

export default Workouts;
