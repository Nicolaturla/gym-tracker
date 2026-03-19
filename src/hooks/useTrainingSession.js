import { useState, useCallback, useEffect, useRef } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '../constants';

/**
 * Hook to manage an active training session.
 * Persists progress to localStorage so the user can resume after accidental navigation.
 */
export function useTrainingSession(workout) {
  const [session, setSession] = useLocalStorage(STORAGE_KEYS.ACTIVE_SESSION, null);

  // Timer: seconds elapsed
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Rest timer
  const [restSeconds, setRestSeconds] = useState(null); // null = not active
  const restRef = useRef(null);

  // Initialize session when workout mounts (or restore existing for same workout)
  useEffect(() => {
    if (!workout) return;

    const isResuming = session?.workoutId === workout.id;

    if (!isResuming) {
      const initial = {
        workoutId: workout.id,
        workoutName: workout.name,
        currentExerciseIndex: 0,
        startedAt: new Date().toISOString(),
        // Map exercises to sets array
        progress: workout.exercises.map((ex) => ({
          exerciseId: ex.id,
          exerciseName: ex.name,
          sets: Array.from({ length: Number(ex.sets) || 3 }, (_, i) => ({
            index: i,
            completed: false,
            reps: ex.reps ?? '',
            weight: ex.weight ?? '',
          })),
        })),
      };
      setSession(initial);
    }
  }, [workout?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Stopwatch
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsed((s) => s + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  // Rest countdown
  useEffect(() => {
    if (restSeconds === null) return;
    if (restSeconds <= 0) {
      setRestSeconds(null);
      return;
    }
    restRef.current = setTimeout(() => setRestSeconds((s) => s - 1), 1000);
    return () => clearTimeout(restRef.current);
  }, [restSeconds]);

  const currentExerciseIndex = session?.currentExerciseIndex ?? 0;
  const progress = session?.progress ?? [];

  const totalSets = progress.reduce((acc, ex) => acc + ex.sets.length, 0);
  const completedSets = progress.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completed).length,
    0
  );
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const isFinished =
    progress.length > 0 && progress.every((ex) => ex.sets.every((s) => s.completed));

  const completeSet = useCallback(
    (exerciseId, setIndex, actualReps, actualWeight) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: prev.progress.map((ex) =>
            ex.exerciseId === exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map((s) =>
                    s.index === setIndex
                      ? { ...s, completed: true, reps: actualReps, weight: actualWeight }
                      : s
                  ),
                }
              : ex
          ),
        };
      });
      // Start rest timer
      setRestSeconds(60);
    },
    [setSession]
  );

  const updateSetField = useCallback(
    (exerciseId, setIndex, field, value) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          progress: prev.progress.map((ex) =>
            ex.exerciseId === exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map((s) =>
                    s.index === setIndex ? { ...s, [field]: value } : s
                  ),
                }
              : ex
          ),
        };
      });
    },
    [setSession]
  );

  const nextExercise = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentExerciseIndex: Math.min(
          prev.currentExerciseIndex + 1,
          prev.progress.length - 1
        ),
      };
    });
  }, [setSession]);

  const prevExercise = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        currentExerciseIndex: Math.max(prev.currentExerciseIndex - 1, 0),
      };
    });
  }, [setSession]);

  const goToExercise = useCallback(
    (index) => {
      setSession((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          currentExerciseIndex: Math.max(0, Math.min(index, prev.progress.length - 1)),
        };
      });
    },
    [setSession]
  );

  const clearSession = useCallback(() => {
    setSession(null);
  }, [setSession]);

  const skipRest = () => setRestSeconds(null);
  const addRestTime = (seconds) => setRestSeconds((s) => (s ?? 0) + seconds);

  // Format elapsed time as mm:ss
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    session,
    currentExerciseIndex,
    progress,
    totalSets,
    completedSets,
    progressPercent,
    isFinished,
    elapsed,
    elapsedFormatted: formatTime(elapsed),
    restSeconds,
    completeSet,
    updateSetField,
    nextExercise,
    prevExercise,
    goToExercise,
    clearSession,
    skipRest,
    addRestTime,
  };
}
