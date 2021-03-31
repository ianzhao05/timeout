import { useState } from "react";
import * as React from "react";
import { useAllExercises } from "../utils";
import { Exercise, ExerciseType, EXERCISE_DESCRIPTORS } from "../types";
import ActivityTable from "./ActivityTable";
import styles from "./AllExercises.module.css";
import formStyles from "./forms/Form.module.css";

type Props = {
  onClick?: (ex: Exercise) => () => void;
  to?: (ex: Exercise) => string;
  small?: boolean;
};

const AllExercises: React.FC<Props> = ({ onClick, to, small = false }) => {
  const { allExercises, loading } = useAllExercises();
  const [search, setSearch] = useState("");
  return (
    <div>
      {loading || !allExercises ? null : (
        <>
          <div className={styles.searchBox}>
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Filter..."
              className={formStyles.textInputSmall}
            />
            {search && (
              <button
                className={styles.clearButton}
                onClick={() => {
                  setSearch("");
                }}
              >
                Clear
              </button>
            )}
          </div>
          {Object.entries(allExercises).map(([type, exs]) => (
            <div key={type}>
              <div className={small ? styles.smallHeader : styles.tableHeader}>
                {EXERCISE_DESCRIPTORS[type as ExerciseType]}
              </div>
              <ActivityTable
                data={exs.filter(
                  (ex) =>
                    !search ||
                    ex.name.toLowerCase().includes(search.toLowerCase())
                )}
                onClick={onClick}
                to={to}
                icon="arrow"
              />
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default AllExercises;
