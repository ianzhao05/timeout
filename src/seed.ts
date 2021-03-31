import { Exercise, Workout } from "./types";

export const seedExercises: Exercise[] = [
  { name: "Push Up", type: "upper", method: "reps" },
  { name: "Push Up (Timed)", type: "upper", method: "time" },
  { name: "Crunch", type: "core", method: "reps" },
  { name: "Crunch (Timed)", type: "core", method: "time" },
  { name: "Squat", type: "lower", method: "reps" },
  { name: "Squat (Timed)", type: "lower", method: "time" },
  { name: "Pull Up", type: "upper", method: "reps" },
  { name: "Jump Rope", type: "cardio", method: "time" },
  { name: "Running", type: "cardio", method: "time" },
  { name: "Sit Up", type: "core", method: "reps" },
  { name: "Chin Up", type: "upper", method: "reps" },
  { name: "Split Squat", type: "lower", method: "reps" },
  { name: "One-Leg Squat", type: "lower", method: "reps" },
  { name: "Burpees", type: "cardio", method: "time" },
];

export const seedWorkouts: Workout[] = [
  {
    name: "Full-Body Starter",
    sections: [
      {
        id: "Axqa9fYCQ37ugUqkKcxfP",
        name: "Warmup",
        sets: [
          {
            id: "VF44BA5TGIOdwzZCD9673",
            exercise: { name: "Jump Rope", type: "cardio", method: "time" },
            repeat: 1,
            reps: 180,
            restBetween: 0,
          },
        ],
        repeat: 1,
        restBetween: 0,
        restAfter: 60,
      },
      {
        id: "lA7n0-Nf9RbN-wxl4_CbA",
        name: "Workout",
        sets: [
          {
            id: "2c-YFN0Ffhit6WF63MAdi",
            exercise: { name: "Push Up", type: "upper", method: "reps" },
            repeat: 3,
            reps: 10,
            restBetween: 60,
          },
          { id: "EanbIJFpfg49Lm78P4JWQ", time: 90 },
          {
            id: "L6TkHEiX-aunqwC2q9kwv",
            exercise: { name: "Squat", type: "lower", method: "reps" },
            repeat: 3,
            reps: 20,
            restBetween: 60,
          },
          { id: "vg7USlveU4UqJxn0PAmjw", time: 90 },
          {
            id: "3SrGLHf2sL6hvp131YUTC",
            exercise: { name: "Pull Up", type: "upper", method: "reps" },
            repeat: 3,
            reps: 5,
            restBetween: 60,
          },
          { id: "QhXYHhX0tOMBcWoixtQ-n", time: 90 },
          {
            id: "9e1rPNIYqp-UHZgpZ2lz0",
            exercise: { name: "Crunch", type: "core", method: "reps" },
            repeat: 3,
            reps: 20,
            restBetween: 60,
          },
        ],
        repeat: 2,
        restBetween: 90,
        restAfter: 0,
      },
    ],
  },
  {
    name: "HIIT Starter",
    sections: [
      {
        id: "65wvP2Un3KHw-iKcd9j6O",
        name: "Workout",
        sets: [
          {
            id: "S_e8paMbD5ot3pCdQ9oI3",
            exercise: { name: "Burpees", type: "cardio", method: "time" },
            repeat: 1,
            reps: 30,
            restBetween: 0,
          },
          { id: "CIwEI-hgmmBL3yPD-Pvnz", time: 10 },
          {
            id: "Xlg287PC_7slTCYT3nMJR",
            exercise: {
              name: "Push Up (Timed)",
              type: "upper",
              method: "time",
            },
            repeat: 1,
            reps: 30,
            restBetween: 0,
          },
          { id: "8o1O819l70EEwgJuyxcVj", time: 10 },
          {
            id: "pF29dv0NLkBeuVuaMDjEH",
            exercise: { name: "Squat (Timed)", type: "lower", method: "time" },
            repeat: 1,
            reps: 30,
            restBetween: 0,
          },
          { id: "xSl8LsSWOeTGWXGCJn4Mm", time: 10 },
          {
            id: "vJ--oK6THqljVIZao0lQ9",
            exercise: { name: "Crunch (Timed)", type: "core", method: "time" },
            repeat: 1,
            reps: 30,
            restBetween: 0,
          },
        ],
        repeat: 5,
        restBetween: 30,
        restAfter: 0,
      },
    ],
  },
];
