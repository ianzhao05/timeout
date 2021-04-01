import Container from "../layout/Container";
import Fixed from "../layout/Fixed";
import Spacer from "../layout/Spacer";
import WorkoutsMenu from "../menus/WorkoutsMenu";
import { Redirect, Route, Switch, useRouteMatch } from "react-router-dom";
import WorkoutForm from "../forms/WorkoutForm";
import ExerciseForm from "../forms/ExerciseForm";
import Exercises from "./Exercises";
import ExerciseInfo from "../ExerciseInfo";
import Workouts from "./Workouts";
import WorkoutEdit from "../forms/WorkoutEdit";

const Activities = () => {
  const { path, url } = useRouteMatch();
  return (
    <div>
      <Fixed position="top">
        <WorkoutsMenu />
      </Fixed>
      <Spacer type="topMenu" />

      <Container>
        <Switch>
          <Route path={`${path}/workouts/new`}>
            <WorkoutForm />
          </Route>
          <Route path={`${path}/workouts/edit/:name`}>
            <WorkoutEdit />
          </Route>
          <Route path={`${path}/exercises/new`}>
            <ExerciseForm />
          </Route>
          <Route path={`${path}/exercises/view/:name`}>
            <ExerciseInfo />
          </Route>
          <Route exact path={`${path}/workouts`}>
            <Workouts url={url} />
          </Route>
          <Route exact path={`${path}/exercises`}>
            <Exercises url={url} />
          </Route>
          <Route exact path={path}>
            <Redirect to={`${path}/workouts`} />
          </Route>
        </Switch>
      </Container>

      <Spacer type="bottom" />
    </div>
  );
};

export default Activities;
