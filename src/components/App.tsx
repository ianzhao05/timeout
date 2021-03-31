import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Start from "./views/Start";
import Fixed from "./layout/Fixed";
import Menu from "./menus/Menu";
import Activities from "./views/Activities";
import History from "./views/History";
import styles from "./App.module.css";
import { ToastContainer, Slide } from "react-toastify";

const App = () => {
  return (
    <div className={styles.container}>
      <Router>
        <Switch>
          <Route path="/start">
            <Start />
          </Route>
          <Route path="/activities">
            <Activities />
          </Route>
          <Route path="/history">
            <History />
          </Route>
          <Route path="/">
            <Redirect to="/start" />
          </Route>
        </Switch>
        <Route>
          {({ location }) =>
            location.pathname.startsWith("/start/workout/") ? null : (
              <Fixed position="bottom">
                <Menu />
              </Fixed>
            )
          }
        </Route>
      </Router>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        transition={Slide}
        hideProgressBar
        closeButton={false}
        closeOnClick
        pauseOnFocusLoss={false}
        pauseOnHover={false}
      />
    </div>
  );
};

export default App;
