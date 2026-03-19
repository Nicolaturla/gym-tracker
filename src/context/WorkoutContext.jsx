import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { STORAGE_KEYS } from '../constants';

const WorkoutContext = createContext(null);

export function WorkoutProvider({ children }) {
  const [workouts, setWorkouts] = useLocalStorage(STORAGE_KEYS.WORKOUTS, []);

  const addWorkout = useCallback((workoutData) => {
    const newWorkout = {
      ...workoutData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setWorkouts((prev) => [...prev, newWorkout]);
    return newWorkout;
  }, [setWorkouts]);

  const updateWorkout = useCallback((id, updates) => {
    setWorkouts((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, ...updates, updatedAt: new Date().toISOString() } : w
      )
    );
  }, [setWorkouts]);

  const deleteWorkout = useCallback((id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  }, [setWorkouts]);

  const getWorkoutById = useCallback((id) => {
    return workouts.find((w) => w.id === id) ?? null;
  }, [workouts]);

  const value = {
    workouts,
    addWorkout,
    updateWorkout,
    deleteWorkout,
    getWorkoutById,
  };

  return (
    <WorkoutContext.Provider value={value}>
      {children}
    </WorkoutContext.Provider>
  );
}

export function useWorkouts() {
  const ctx = useContext(WorkoutContext);
  if (!ctx) throw new Error('useWorkouts must be used inside WorkoutProvider');
  return ctx;
}
