import { openDB, DBSchema } from "idb/with-async-ittr";
import { seedExercises, seedWorkouts } from "./seed";
import { Exercise, AllExercises, Workout, WorkoutLog } from "./types";
import { initAllExercises } from "./utils";

interface Schema extends DBSchema {
  exercises: {
    key: number;
    value: Exercise;
    indexes: { name: string };
  };
  workouts: {
    key: number;
    value: Workout;
    indexes: { name: string };
  };
  logs: {
    key: number;
    value: WorkoutLog;
    indexes: { date: Date };
  };
}

const dbPromise = openDB<Schema>("edb", 1, {
  upgrade: (db, oldVersion) => {
    switch (oldVersion) {
      case 0:
      case 1:
        const exStore = db.createObjectStore("exercises", {
          autoIncrement: true,
        });
        exStore.createIndex("name", "name", { unique: true });
        const woStore = db.createObjectStore("workouts", {
          autoIncrement: true,
        });
        woStore.createIndex("name", "name", { unique: true });
        const lgStore = db.createObjectStore("logs", { autoIncrement: true });
        lgStore.createIndex("date", "date");

        for (const ex of seedExercises) {
          exStore.add(ex);
        }
        for (const wo of seedWorkouts) {
          woStore.add(wo);
        }
    }
  },
});

const dbService = {
  getAllExercises: async () => {
    const data = await dbPromise.then((db) => db.getAll("exercises"));
    const allExercises: AllExercises = initAllExercises();
    for (const ex of data) {
      if (ex.type) {
        allExercises[ex.type].push(ex);
      }
    }
    return allExercises;
  },
  getExercise: (name: string) =>
    dbPromise.then((db) => db.getFromIndex("exercises", "name", name)),
  createExercise: (ex: Exercise) =>
    dbPromise.then((db) => db.add("exercises", ex)),
  getAllWorkouts: () => dbPromise.then((db) => db.getAll("workouts")),
  getWorkout: (name: string) =>
    dbPromise.then((db) => db.getFromIndex("workouts", "name", name)),
  createWorkout: (wo: Workout) =>
    dbPromise.then((db) => db.add("workouts", wo)),
  updateWorkout: async (wo: Workout, oldName: string) => {
    const db = await dbPromise;
    const tx = db.transaction("workouts", "readwrite");
    const idx = tx.store.index("name");
    const cursor = (await idx.iterate(oldName).next()).value;
    await cursor.update(wo);
    await tx.done;
  },
  deleteWorkout: async (name: string) => {
    const db = await dbPromise;
    const tx = db.transaction("workouts", "readwrite");
    const idx = tx.store.index("name");
    const cursor = (await idx.iterate(name).next()).value;
    await cursor.delete();
    await tx.done;
  },
  getAllLogs: () =>
    dbPromise
      .then((db) => db.getAllFromIndex("logs", "date"))
      .then((logs) => logs.reverse()),
  getLog: (id: number) => dbPromise.then((db) => db.get("logs", id)),
  createLog: (lg: WorkoutLog) => dbPromise.then((db) => db.add("logs", lg)),
};

export default dbService;
