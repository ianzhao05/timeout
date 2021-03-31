import fStyles from "./Form.module.css";
import efStyles from "./ExerciseForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ExerciseMethod, ExerciseType } from "../../types";
import dbService from "../../db";
import { useHistory } from "react-router-dom";
import SmallButton from "../inputs/SmallButton";
import Persist from "../Persist";
import * as Yup from "yup";
import LargeButton from "../inputs/LargeButton";
import { toast } from "react-toastify";

const styles = { ...fStyles, ...efStyles };

type Values = {
  name: string;
  type: ExerciseType | null;
  method: ExerciseMethod | null;
};
const Schema = Yup.object().shape({
  name: Yup.string().trim().required("Enter a name"),
  type: Yup.mixed().required("Select the exercise type"),
  method: Yup.mixed().required("Select how the exercise should be measured"),
});

const initialValues: Values = {
  name: "",
  type: null,
  method: null,
};

const ExerciseForm = () => {
  const history = useHistory();
  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerButton}>
          <SmallButton icon="arrow" flip to="/activities/exercises" />
        </div>
        <h2 className={styles.headerCenter}>New Exercise</h2>
      </div>
      <Formik
        initialValues={initialValues}
        onSubmit={async (values, actions) => {
          if (values.type === null || values.method === null) {
            return;
          }
          const { name, type, method } = values;
          try {
            await dbService.createExercise({ name: name.trim(), type, method });
            toast.success("Exercise created!");
            history.push("/activities/exercises");
          } catch {
            actions.setFieldError("name", "Name already exists");
          }
        }}
        validationSchema={Schema}
      >
        {({ resetForm }) => (
          <Form className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="name" className={styles.inputLabel}>
                Name
              </label>
              <Field id="name" name="name" className={styles.textInput} />
              <ErrorMessage name="name">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>
            </div>
            <div className={styles.inputGroup}>
              <div className={styles.inputLabel}>Exercise Type</div>
              <div className={styles.radio}>
                <Field
                  type="radio"
                  name="type"
                  className={styles.radioButton}
                  value="upper"
                  id="upper"
                />
                <label htmlFor="upper" className={styles.radioLabelBlue}>
                  Upper Body
                </label>
              </div>
              <div className={styles.radio}>
                <Field
                  type="radio"
                  name="type"
                  className={styles.radioButton}
                  value="lower"
                  id="lower"
                />
                <label htmlFor="lower" className={styles.radioLabelGreen}>
                  Lower Body
                </label>
              </div>
              <div className={styles.radio}>
                <Field
                  type="radio"
                  name="type"
                  className={styles.radioButton}
                  value="core"
                  id="core"
                />
                <label htmlFor="core" className={styles.radioLabelRed}>
                  Core/Abs
                </label>
              </div>
              <div className={styles.radio}>
                <Field
                  type="radio"
                  name="type"
                  className={styles.radioButton}
                  value="cardio"
                  id="cardio"
                />
                <label htmlFor="cardio" className={styles.radioLabelYellow}>
                  Cardio
                </label>
              </div>
              <div className={styles.radio}>
                <Field
                  type="radio"
                  name="type"
                  className={styles.radioButton}
                  value="other"
                  id="other"
                />
                <label htmlFor="other" className={styles.radioLabelPurple}>
                  Other
                </label>
              </div>
              <ErrorMessage name="type">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="method" className={styles.inputLabel}>
                Measurement Method
              </label>
              <div className={styles.multiContainer}>
                <div className={`${styles.radio} ${styles.half}`}>
                  <Field
                    type="radio"
                    name="method"
                    className={styles.radioButton}
                    value="reps"
                    id="reps"
                  />
                  <label htmlFor="reps" className={styles.radioLabel}>
                    Reps
                  </label>
                </div>
                <div className={`${styles.radio} ${styles.half}`}>
                  <Field
                    type="radio"
                    name="method"
                    className={styles.radioButton}
                    value="time"
                    id="time"
                  />
                  <label htmlFor="time" className={styles.radioLabel}>
                    Time
                  </label>
                </div>
              </div>
              <ErrorMessage name="method">
                {(msg) => <div className={styles.error}>{msg}</div>}
              </ErrorMessage>
            </div>
            <div className={styles.largeButtons}>
              <LargeButton
                text="Save"
                type="submit"
                color="blue"
                inverted
                bigText
              />
              <LargeButton text="Reset" color="red" onClick={resetForm} />
            </div>
            <Persist name="exerciseForm" isSessionStorage clearIfSubmitted />
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ExerciseForm;
