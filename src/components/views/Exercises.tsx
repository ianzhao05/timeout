import * as React from "react";
import Fixed from "../layout/Fixed";
import LargeButton from "../inputs/LargeButton";
import Spacer from "../layout/Spacer";
import AllExercises from "../AllExercises";

type Props = {
  url: string;
};

const Exercises: React.FC<Props> = ({ url }) => {
  return (
    <>
      <AllExercises to={(ex) => `${url}/exercises/view/${ex.name}`} />
      <Spacer type="bottomAbove" />
      <Fixed position="bottomAbove">
        <LargeButton
          text="New Exercise"
          color="blue"
          icon="plus"
          to={`${url}/exercises/new`}
        />
      </Fixed>
    </>
  );
};

export default Exercises;
