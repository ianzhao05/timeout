import { getTimePhrase } from "../../utils";
import AllWorkouts from "../AllWorkouts";
import Container from "../layout/Container";
import styles from "./Start.module.css";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import WorkoutInfo from "../WorkoutInfo";
import WorkingOut from "./WorkingOut";
import Spacer from "../layout/Spacer";

const Start = () => {
  const { path, url } = useRouteMatch();
  return (
    <Container>
      <Switch>
        <Route path={`${path}/preview/:name`}>
          <Spacer type="top" />
          <WorkoutInfo />
        </Route>
        <Route path={`${path}/workout/:name`}>
          <Spacer type="top" />
          <WorkingOut />
        </Route>
        <Route path={path} exact>
          <h1 className={`${styles.header} ${styles.center}`}>
            Good {getTimePhrase()}!
          </h1>
          <AllWorkouts icon="arrow" to={(wo) => `${url}/preview/${wo.name}`} />
        </Route>
      </Switch>
    </Container>
  );
};

export default Start;
