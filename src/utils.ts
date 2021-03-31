import { nanoid } from "nanoid";
import { useState, useEffect, useCallback } from "react";
import dbService from "./db";
import { AllExercises, WorkoutSection, ExerciseSet } from "./types";

export const COLORS: { [key: string]: string } = {
  dark: "#2a2b30",
  "dark-light": "#edeff2",
  light: "#fafcff",
  blue: "#0d47f5",
  "blue-neutral": "#718bff",
  "blue-light": "#e9eefc",
  "blue-dark": "#0d33aa",
  green: "#27bfb3",
  "green-light": "#e8fcfa",
  "green-dark": "#196d66",
  red: "#f0447e",
  "red-light": "#fff2f8",
  "red-dark": "#a92552",
  yellow: "#ffbb38",
  "yellow-light": "#fdf6e4",
  "yellow-dark": "#88621c",
  purple: "#db3edf",
  "purple-light": "#f6e5fb",
  "purple-dark": "#9c209f",
};

export const initAllExercises = (): AllExercises => ({
  upper: [],
  lower: [],
  core: [],
  cardio: [],
  other: [],
});

export const initWorkoutSection = (name?: string): WorkoutSection => ({
  id: nanoid(),
  name: name ?? "New Section",
  sets: [],
  repeat: 1,
  restBetween: 0,
  restAfter: 0,
});

export const isExerciseSet = (s: any): s is ExerciseSet => "reps" in s;

export const pluralize = (n: number, s: string): string =>
  n === 1 ? s : s + "s";

export const secToMinSec = (s: number): [number, number] => [
  Math.floor(s / 60),
  s % 60,
];

export const minSecToString = (
  [min, sec]: [number, number],
  format: "short" | "long"
): string =>
  format === "short"
    ? `${min}:${sec < 10 ? "0" : ""}${sec}`
    : `${min ? `${min} min` : ""}${sec ? ` ${sec} sec` : ""}`;

export const getTimePhrase = (): string => {
  const hour = new Date().getHours();
  return (
    (hour < 12 && "Morning") ||
    (hour < 18 && "Afternoon") ||
    (hour < 21 && "Evening") ||
    "Night"
  );
};

const useData = <T>(
  asyncFn: () => Promise<T | undefined>,
  initial?: T
): [T | undefined, boolean] => {
  const [data, setData] = useState<T | undefined>(initial);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;
    (async () => {
      const newData = await asyncFn();
      if (isMounted) {
        setData(newData);
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, [asyncFn]);
  return [data, loading];
};

export const useAllExercises = () => {
  const [allExercises, loading] = useData<AllExercises>(
    dbService.getAllExercises,
    initAllExercises()
  );
  return { allExercises, loading };
};

export const useExercise = (name: string) => {
  const cb = useCallback(() => dbService.getExercise(name), [name]);
  const [exercise, loading] = useData(cb);
  return { exercise, loading };
};

export const useAllWorkouts = () => {
  const [allWorkouts, loading] = useData(dbService.getAllWorkouts);
  return { allWorkouts, loading };
};

export const useWorkout = (name: string) => {
  const cb = useCallback(() => dbService.getWorkout(name), [name]);
  const [workout, loading] = useData(cb);
  return { workout, loading };
};

export const useAllLogs = () => {
  const [allLogs, loading] = useData(dbService.getAllLogs);
  return { allLogs, loading };
};
