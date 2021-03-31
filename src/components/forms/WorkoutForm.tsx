import { useState } from "react";
import * as React from "react";
import fStyles from "./Form.module.css";
import wfStyles from "./WorkoutForm.module.css";
import {
  Formik,
  Form,
  Field,
  FastField,
  FieldArray,
  ErrorMessage,
  useFormikContext,
} from "formik";
import LargeButton from "../inputs/LargeButton";
import { ExerciseSet, Rest, Workout, WorkoutSection } from "../../types";
import SmallButton from "../inputs/SmallButton";
import Persist from "../Persist";
import * as Yup from "yup";
import Modal from "../layout/Modal";
import ExerciseSelect from "./ExerciseSelect";
import dbService from "../../db";
import { useHistory } from "react-router-dom";
import Icon from "../Icon";
import { initWorkoutSection, isExerciseSet } from "../../utils";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";

const styles = { ...fStyles, ...wfStyles };

type Values = Workout;
const Schema = Yup.object({
  name: Yup.string().trim().required("Enter a workout name"),
  sections: Yup.array(
    Yup.object({
      name: Yup.string().trim().required("Enter a section name"),
      repeat: Yup.number()
        .required("Required")
        .min(1, "At least 1 cycle")
        .max(10, "At most 10 cycles")
        .integer("Must be integer"),
      restBetween: Yup.number()
        .required("Required")
        .min(0, "At least 0 sec")
        .max(1000, "At most 1000 sec")
        .integer("Must be integer"),
      restAfter: Yup.number()
        .required("Required")
        .min(0, "At least 0 sec")
        .max(1000, "At most 1000 sec")
        .integer("Must be integer"),
      sets: Yup.array(
        Yup.lazy((val) => {
          if (isExerciseSet(val)) {
            return Yup.object({
              repeat: Yup.number()
                .required("Required")
                .min(1, "At least 1 set")
                .max(10, "At most 10 sets")
                .integer("Must be integer"),
              restBetween: Yup.number().when("repeat", {
                is: (v: number) => v < 2,
                then: Yup.number(),
                otherwise: Yup.number()
                  .required("Required")
                  .min(1, "At least 1 sec")
                  .max(1000, "At most 1000 sec")
                  .integer("Must be integer"),
              }),
              reps:
                val.exercise.method === "reps"
                  ? Yup.number()
                      .required("Required")
                      .min(1, "At least 1 rep")
                      .max(1000, "At most 1000 reps")
                      .integer("Must be integer")
                  : Yup.number()
                      .required("Required")
                      .min(0, "At least 0 sec")
                      .max(1000, "At most 1000 sec")
                      .integer("Must be integer"),
            });
          } else {
            return Yup.object({
              time: Yup.number()
                .required("Required")
                .min(0, "At least 0 sec")
                .max(1000, "At most 1000 sec")
                .integer("Must be integer"),
            });
          }
        })
      ).required("Add at least one set"),
    })
  ).required("Add at least one section"),
});

const initialValues: Values = {
  name: "",
  sections: [],
};

const WorkoutView: React.FC<{
  setSection: (n: number | null) => void;
  deleteWorkout?: () => void;
}> = ({ setSection, deleteWorkout }) => {
  const { values, errors, resetForm } = useFormikContext<Values>();
  return (
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.inputLabel}>
          Name
        </label>
        <FastField id="name" name="name" className={styles.textInput} />
        <ErrorMessage name="name">
          {(msg) => <div className={styles.error}>{msg}</div>}
        </ErrorMessage>
      </div>
      <div className={styles.inputGroup}>
        <FieldArray name="sections">
          {(arrayHelpers) => (
            <DragDropContext
              onDragEnd={({ source, destination }) => {
                if (destination) {
                  arrayHelpers.move(source.index, destination.index);
                }
              }}
            >
              <Droppable droppableId="droppableSections">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {values.sections.map((section, idx) => (
                      <Draggable
                        draggableId={section.id}
                        key={section.id}
                        index={idx}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={styles.section}
                          >
                            <div
                              {...provided.dragHandleProps}
                              className={styles.dragHandle}
                            >
                              <Icon icon="drag" className={styles.dragIcon} />
                            </div>
                            <button
                              key={section.id}
                              className={styles.sectionLink}
                              onClick={() => {
                                setSection(idx);
                              }}
                            >
                              <div>{section.name}</div>
                              <Icon icon="pencil" className={styles.editIcon} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
              <LargeButton
                text="New Section"
                color="blue"
                icon="plus"
                onClick={() => {
                  arrayHelpers.push(
                    initWorkoutSection(`Section ${values.sections.length + 1}`)
                  );
                }}
              />
              <div className={styles.error}>
                {typeof errors.sections === "string"
                  ? errors.sections
                  : errors.sections &&
                    errors.sections.some((e: any) => e) &&
                    "One or more sections have errors"}
              </div>
            </DragDropContext>
          )}
        </FieldArray>
      </div>
      <div className={styles.largeButtons}>
        <LargeButton
          text={deleteWorkout ? "Save Changes" : "Create Workout"}
          type="submit"
          color="blue"
          inverted
          bigText
        />
        <LargeButton
          text={deleteWorkout ? "Discard Changes" : "Reset"}
          color="red"
          onClick={resetForm}
        />
        {deleteWorkout && (
          <LargeButton
            text="Delete Workout"
            color="red"
            onClick={deleteWorkout}
          />
        )}
      </div>
    </>
  );
};

const SectionView: React.FC<{
  section: number;
  goBack: () => void;
}> = ({ section: currSection, goBack }) => {
  const {
    values,
    errors,
    touched,
    validateForm,
    setValues,
  } = useFormikContext<Values>();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className={styles.inputGroup}>
        <label htmlFor="sectionName" className={styles.inputLabel}>
          Section Name
        </label>
        <FastField
          id="sectionName"
          name={`sections.${currSection}.name`}
          className={styles.textInput}
        />
        {(() => {
          if (!Array.isArray(errors.sections)) {
            return null;
          }
          const error = errors.sections[currSection];
          if (typeof error === "string" || !error?.name) {
            return null;
          }
          return (
            touched.sections?.[currSection]?.name &&
            error.name && <div className={styles.error}>{error.name}</div>
          );
        })()}
      </div>
      <div className={styles.inputLabel}>Section Options</div>
      <div className={`${styles.inputGroup} ${styles.multiContainer}`}>
        <div className={styles.third}>
          <label htmlFor="repeat" className={styles.inputLabelSmall}>
            Repeat
          </label>
          <div className={styles.inputWithText}>
            <FastField
              id="repeat"
              className={styles.numberInput}
              name={`sections.${currSection}.repeat`}
              type="number"
              min="1"
              step="1"
              pattern="[0-9]*"
            />
            <div className={styles.inputSuffix}>time(s)</div>
          </div>
          <ErrorMessage name={`sections.${currSection}.repeat`}>
            {(msg) => <div className={styles.errorSmall}>{msg}</div>}
          </ErrorMessage>
        </div>
        <div className={styles.third}>
          <label htmlFor="restBetween" className={styles.inputLabelSmall}>
            Rest Between
          </label>
          <div className={styles.inputWithText}>
            <Field
              id="restBetween"
              className={styles.numberInput}
              name={`sections.${currSection}.restBetween`}
              type="number"
              min="0"
              step="1"
              pattern="[0-9]*"
              disabled={values.sections[currSection].repeat < 2}
            />
            <div className={styles.inputSuffix}>sec</div>
          </div>
          <ErrorMessage name={`sections.${currSection}.restBetween`}>
            {(msg) => <div className={styles.errorSmall}>{msg}</div>}
          </ErrorMessage>
        </div>
        <div className={styles.third}>
          <label htmlFor="restAfter" className={styles.inputLabelSmall}>
            Rest After
          </label>
          <div className={styles.inputWithText}>
            <FastField
              id="restAfter"
              className={styles.numberInput}
              name={`sections.${currSection}.restAfter`}
              type="number"
              min="0"
              step="1"
              pattern="[0-9]*"
            />
            <div className={styles.inputSuffix}>sec</div>
          </div>
          <ErrorMessage name={`sections.${currSection}.restAfter`}>
            {(msg) => <div className={styles.errorSmall}>{msg}</div>}
          </ErrorMessage>
        </div>
      </div>
      <div className={styles.exHeader}>Exercises</div>
      <FieldArray name={`sections.${currSection}.sets`}>
        {(arrayHelpers) => (
          <DragDropContext
            onDragEnd={({ source, destination }) => {
              if (destination) {
                arrayHelpers.move(source.index, destination.index);
              }
            }}
          >
            <Droppable droppableId="droppableSets">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {values.sections[currSection].sets.map((set, idx) => (
                    <Draggable draggableId={set.id} key={set.id} index={idx}>
                      {(provided) => {
                        if (isExerciseSet(set)) {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={styles.section}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={styles.dragHandle}
                              >
                                <Icon icon="drag" className={styles.dragIcon} />
                              </div>
                              <div
                                className={`${styles[set.exercise.type]} ${
                                  styles.set
                                }`}
                              >
                                <div className={styles.inputLabel}>
                                  {set.exercise.name}
                                  {set.exercise.method === "time" && (
                                    <div className={styles.inputLabelSub}>
                                      Input 0 sec to count up like a stopwatch
                                    </div>
                                  )}
                                </div>
                                <div className={styles.multiContainer}>
                                  <div className={styles.third}>
                                    <label
                                      htmlFor={`sets${idx}`}
                                      className={styles.inputLabelSmall}
                                    >
                                      Sets
                                    </label>
                                    <FastField
                                      id={`sets${idx}`}
                                      className={styles.numberInput}
                                      name={`sections.${currSection}.sets.${idx}.repeat`}
                                      type="number"
                                      min="1"
                                      step="1"
                                      pattern="[0-9]*"
                                    />
                                    <ErrorMessage
                                      name={`sections.${currSection}.sets.${idx}.repeat`}
                                    >
                                      {(msg) => (
                                        <div className={styles.errorSmall}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                  {set.exercise.method === "reps" ? (
                                    <div className={styles.third}>
                                      <label
                                        htmlFor={`reps${idx}`}
                                        className={styles.inputLabelSmall}
                                      >
                                        Reps / Set
                                      </label>
                                      <FastField
                                        id={`reps${idx}`}
                                        className={styles.numberInput}
                                        name={`sections.${currSection}.sets.${idx}.reps`}
                                        type="number"
                                        min="1"
                                        step="1"
                                        pattern="[0-9]*"
                                      />
                                      <ErrorMessage
                                        name={`sections.${currSection}.sets.${idx}.reps`}
                                      >
                                        {(msg) => (
                                          <div className={styles.errorSmall}>
                                            {msg}
                                          </div>
                                        )}
                                      </ErrorMessage>
                                    </div>
                                  ) : (
                                    <div className={styles.third}>
                                      <label
                                        htmlFor={`reps${idx}`}
                                        className={styles.inputLabelSmall}
                                      >
                                        Time / Set
                                      </label>
                                      <div className={styles.inputWithText}>
                                        <FastField
                                          id={`reps${idx}`}
                                          className={styles.numberInput}
                                          name={`sections.${currSection}.sets.${idx}.reps`}
                                          type="number"
                                          min="1"
                                          step="1"
                                          pattern="[0-9]*"
                                        />
                                        <div className={styles.inputSuffix}>
                                          sec
                                        </div>
                                      </div>
                                      <ErrorMessage
                                        name={`sections.${currSection}.sets.${idx}.reps`}
                                      >
                                        {(msg) => (
                                          <div className={styles.errorSmall}>
                                            {msg}
                                          </div>
                                        )}
                                      </ErrorMessage>
                                    </div>
                                  )}
                                  <div className={styles.third}>
                                    <label
                                      htmlFor={`restBetween${idx}`}
                                      className={styles.inputLabelSmall}
                                    >
                                      Rest Between
                                    </label>
                                    <div className={styles.inputWithText}>
                                      <Field
                                        id={`restBetween${idx}`}
                                        className={styles.numberInput}
                                        name={`sections.${currSection}.sets.${idx}.restBetween`}
                                        type="number"
                                        min="0"
                                        step="1"
                                        pattern="[0-9]*"
                                        disabled={set.repeat < 2}
                                      />
                                      <div className={styles.inputSuffix}>
                                        sec
                                      </div>
                                    </div>
                                    <ErrorMessage
                                      name={`sections.${currSection}.sets.${idx}.restBetween`}
                                    >
                                      {(msg) => (
                                        <div className={styles.errorSmall}>
                                          {msg}
                                        </div>
                                      )}
                                    </ErrorMessage>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  className={styles.deleteButton}
                                  onClick={() => {
                                    arrayHelpers.remove(idx);
                                  }}
                                >
                                  <Icon icon="x" />
                                </button>
                              </div>
                            </div>
                          );
                        } else {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={styles.section}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className={styles.dragHandle}
                              >
                                <Icon icon="drag" className={styles.dragIcon} />
                              </div>
                              <div className={`${styles.rest} ${styles.set}`}>
                                <label
                                  htmlFor={`${idx}time`}
                                  className={styles.inputLabel}
                                >
                                  Rest
                                  <div className={styles.inputLabelSub}>
                                    Input 0 sec to count up like a stopwatch
                                  </div>
                                </label>
                                <FastField
                                  id={`${idx}time`}
                                  name={`sections.${currSection}.sets.${idx}.time`}
                                  className={styles.numberInputThird}
                                  type="number"
                                  min="1"
                                  step="1"
                                  pattern="[0-9]*"
                                />
                                <span className={styles.inputSuffix}>
                                  seconds
                                </span>
                                <ErrorMessage
                                  name={`sections.${currSection}.sets.${idx}.time`}
                                >
                                  {(msg) => (
                                    <div className={styles.errorSmall}>
                                      {msg}
                                    </div>
                                  )}
                                </ErrorMessage>
                                <button
                                  type="button"
                                  className={styles.deleteButton}
                                  onClick={() => {
                                    arrayHelpers.remove(idx);
                                  }}
                                >
                                  <Icon icon="x" />
                                </button>
                              </div>
                            </div>
                          );
                        }
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
            {(() => {
              if (!Array.isArray(errors.sections)) {
                return null;
              }
              const error = errors.sections[currSection];
              if (typeof error === "string" || !error?.sets) {
                return null;
              }
              return (
                typeof error.sets === "string" &&
                values.sections[currSection].sets.length === 0 && (
                  <div className={styles.error}>{error.sets}</div>
                )
              );
            })()}
            <div className={`${styles.inputGroup} ${styles.multiContainer}`}>
              <div className={styles.half}>
                <LargeButton
                  text="Exercise"
                  color="blue"
                  icon="plus"
                  shrink
                  onClick={() => {
                    setModalOpen(true);
                  }}
                />
              </div>
              <div className={styles.half}>
                <LargeButton
                  text="Rest"
                  color="dark"
                  icon="plus"
                  shrink
                  onClick={() => {
                    arrayHelpers.push({
                      id: nanoid(),
                      time: 30,
                    } as Rest);
                  }}
                />
              </div>
            </div>
            <Modal
              isOpen={modalOpen}
              close={() => {
                setModalOpen(false);
              }}
            >
              <ExerciseSelect
                close={() => {
                  setModalOpen(false);
                }}
                onSelect={(ex) => {
                  arrayHelpers.push({
                    id: nanoid(),
                    exercise: ex,
                    repeat: 1,
                    reps: 10,
                    restBetween: 0,
                  } as ExerciseSet);
                }}
              />
            </Modal>
          </DragDropContext>
        )}
      </FieldArray>
      <div className={styles.largeButtons}>
        <LargeButton
          text="Save Section"
          type="button"
          color="blue"
          inverted
          bigText
          onClick={async () => {
            const errors = await validateForm();
            if (
              !errors.sections ||
              (Array.isArray(errors.sections) &&
                (!errors.sections[currSection] ||
                  Object.keys(errors.sections[currSection]).length === 0))
            ) {
              toast.success("Section saved!");
              goBack();
            }
          }}
        />
        <LargeButton
          text="Clear Section"
          color="red"
          onClick={() => {
            setValues({
              name: values.name,
              sections: values.sections.map((section, i) =>
                i === currSection
                  ? initWorkoutSection(`Section ${i + 1}`)
                  : section
              ),
            });
          }}
        />
        <LargeButton
          text="Delete Section"
          color="red"
          onClick={() => {
            setValues({
              name: values.name,
              sections: values.sections.filter((_, i) => i !== currSection),
            });
            toast.error("Section deleted.");
            goBack();
          }}
        />
      </div>
    </>
  );
};

type Props = {
  values?: Values;
};

const WorkoutForm: React.FC<Props> = ({ values: editVals }) => {
  const [currSection, setCurrSection] = useState<number | null>(null);
  const history = useHistory();

  return (
    <div>
      <div className={styles.headerContainer}>
        <div className={styles.headerButton}>
          {currSection === null ? (
            <SmallButton icon="arrow" flip to={"/activities/workouts"} />
          ) : (
            <div style={{ flex: 1 }} />
          )}
        </div>
        <h2 className={styles.headerCenter}>
          {currSection === null
            ? `${editVals ? "Edit" : "New"} Workout`
            : "Edit Section"}
        </h2>
      </div>
      <Formik
        initialValues={editVals ?? initialValues}
        onSubmit={async (values, actions) => {
          const sections: WorkoutSection[] = values.sections.map((section) => ({
            ...section,
            restBetween: section.repeat < 2 ? 0 : section.restBetween,
            sets: section.sets.map((set) =>
              isExerciseSet(set)
                ? { ...set, restBetween: set.repeat < 2 ? 0 : set.restBetween }
                : set
            ),
          }));
          const wo = { name: values.name, sections };
          try {
            if (editVals) {
              await dbService.updateWorkout(wo, editVals.name);
            } else {
              await dbService.createWorkout(wo);
            }
            toast.success(`${editVals ? "Changes" : "Workout"} saved!`);
            history.push("/activities/workouts");
          } catch {
            actions.setFieldError("name", "Name already exists");
          }
        }}
        validationSchema={Schema}
        validateOnBlur={true}
        validateOnChange={false}
      >
        {() => (
          <Form className={styles.form}>
            {currSection === null ? (
              <WorkoutView
                setSection={setCurrSection}
                deleteWorkout={
                  editVals &&
                  (() => {
                    if (editVals) {
                      dbService.deleteWorkout(editVals.name);
                      toast.error("Workout deleted.");
                      history.push("/activities/workouts");
                    }
                  })
                }
              />
            ) : (
              <SectionView
                section={currSection}
                goBack={() => {
                  setCurrSection(null);
                }}
              />
            )}
            {!editVals && (
              <Persist name="workoutForm" isSessionStorage clearIfSubmitted />
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default WorkoutForm;
