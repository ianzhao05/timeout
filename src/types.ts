export type Exercise = {
  name: string;
  type: ExerciseType;
  method: ExerciseMethod;
};

export type ExerciseType = "upper" | "lower" | "core" | "cardio" | "other";
export type ExerciseMethod = "reps" | "time";
export type ExerciseColor = "blue" | "green" | "red" | "yellow" | "purple";

export const EXERCISE_DESCRIPTORS = {
  upper: "Upper Body",
  lower: "Lower Body",
  core: "Core/Abs",
  cardio: "Cardio",
  other: "Other",
};

export const EXERCISE_COLORS: { [K in ExerciseType]: ExerciseColor } = {
  upper: "blue",
  lower: "green",
  core: "red",
  cardio: "yellow",
  other: "purple",
};

export type AllExercises = { [K in ExerciseType]: Exercise[] };

export type Workout = {
  name: string;
  sections: WorkoutSection[];
};

export type WorkoutSection = {
  id: string;
  name: string;
  sets: (ExerciseSet | Rest)[];
  repeat: number;
  restBetween: number;
  restAfter: number;
};

export type ExerciseSet = {
  id: string;
  exercise: Exercise;
  repeat: number;
  reps: number;
  restBetween: number;
};

export type Rest = {
  id: string;
  time: number;
};

export type IconName =
  | "activity"
  | "arrow"
  | "audio"
  | "calendar"
  | "checkmark"
  | "drag"
  | "dumbbell"
  | "minus"
  | "mute"
  | "pause"
  | "pencil"
  | "play"
  | "plus"
  | "restart"
  | "run"
  | "x";

export type Log = { exercise: Exercise; sets: number; reps: number }[];
export type WorkoutLog = {
  name: string;
  date: Date;
  duration: number;
  log: Log;
};
