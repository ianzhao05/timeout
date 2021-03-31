import { minSecToString, secToMinSec, useAllLogs } from "../../utils";
import Container from "../layout/Container";
import WorkoutLog from "../WorkoutLog";
import styles from "./History.module.css";

const History = () => {
  const { allLogs, loading } = useAllLogs();
  return (
    <Container>
      <h2 className={styles.header}>History</h2>
      {loading || !allLogs ? null : allLogs.length ? (
        allLogs.map((log, i) => (
          <div key={i} className={styles.log}>
            <div className={styles.name}>{log.name}</div>
            <div className={styles.date}>
              {log.date.toDateString()},{" "}
              {minSecToString(secToMinSec(log.duration), "long")}
            </div>
            <WorkoutLog log={log.log} />
          </div>
        ))
      ) : (
        <div className={styles.log}>No workouts completed yet!</div>
      )}
    </Container>
  );
};

export default History;
