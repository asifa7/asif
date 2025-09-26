import React, { useState, useEffect, useMemo } from 'react';
import type { Session, SessionExercise, SetEntry, WeightUnit } from '../types';
import { WORKOUT_TEMPLATES } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ExerciseCard from './ExerciseCard';
import Icon from './common/Icon';

interface WorkoutSessionProps {
  sessionId: string;
  onExit: () => void;
  unit: WeightUnit;
}

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ sessionId, onExit, unit }) => {
  const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', []);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const activeSession = sessions.find(s => s.id === sessionId);
    if (activeSession) {
      setSession(activeSession);
    } else {
      // Session not found, maybe exit
      onExit();
    }
  }, [sessionId, sessions, onExit]);

  const updateSession = (updatedSession: Session) => {
    setSessions(prevSessions =>
      prevSessions.map(s => (s.id === sessionId ? updatedSession : s))
    );
  };
  
  const updateSet = (exerciseId: string, setId: string, newSetData: Partial<SetEntry>) => {
    if (!session) return;
    const updatedExercises = session.exercises.map(ex => {
      if (ex.id === exerciseId) {
        return {
          ...ex,
          sets: ex.sets.map(set => {
            if (set.id === setId) {
              const updatedSet = { ...set, ...newSetData };
              updatedSet.volume = updatedSet.reps * updatedSet.weight;
              return updatedSet;
            }
            return set;
          }),
        };
      }
      return ex;
    });
    setSession({...session, exercises: updatedExercises });
  };
  
  const addSet = (exerciseId: string) => {
    if (!session) return;
    const newSet: SetEntry = { id: `set-${Date.now()}`, reps: 12, weight: 0, volume: 0 };
    const updatedExercises = session.exercises.map(ex => ex.id === exerciseId ? {...ex, sets: [...ex.sets, newSet]} : ex)
    setSession({ ...session, exercises: updatedExercises });
  };

  const removeSet = (exerciseId: string, setId: string) => {
    if (!session) return;
    const updatedExercises = session.exercises.map(ex => ex.id === exerciseId ? {...ex, sets: ex.sets.filter(s => s.id !== setId)} : ex)
    setSession({ ...session, exercises: updatedExercises });
  };
  
  const totalVolume = useMemo(() => {
    if (!session) return 0;
    return session.exercises.reduce((total, ex) => total + ex.sets.reduce((exTotal, set) => exTotal + set.volume, 0), 0);
  }, [session]);

  const handleSaveAndExit = () => {
    if (!session) return;
    const sessionToSave = { ...session, totalVolume };
    updateSession(sessionToSave);
    onExit();
  };

  const handleFinishWorkout = () => {
    if (!session) return;
    const finishedSession = {
      ...session,
      totalVolume,
      status: 'completed' as const,
      completedAt: new Date().toISOString(),
    };
    updateSession(finishedSession);
    onExit();
  };

  if (!session) {
    return <div className="text-center p-8"><Icon name="spinner" className="text-2xl" /> Loading session...</div>;
  }
  
  const template = WORKOUT_TEMPLATES.find(t => t.id === session.templateId);

  return (
    <div className="pb-28">
      <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
        <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">{template?.title || "Workout"}</h2>
        <p className="text-neutral-600 dark:text-neutral-400">{template?.dayOfWeek}</p>
      </div>

      <div className="space-y-6">
        {session.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            unit={unit}
            onUpdateSet={updateSet}
            onAddSet={addSet}
            onRemoveSet={removeSet}
          />
        ))}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 z-30">
        <div className="container mx-auto px-4">
          <div className="bg-neutral-100 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-xl shadow-lg h-24 p-5 flex justify-between items-center gap-4">
            <div>
              <span className="text-sm text-neutral-500 dark:text-neutral-400">Total Volume</span>
              <p className="text-2xl font-bold">{totalVolume.toLocaleString()} {unit}</p>
            </div>
            <div className="flex gap-3">
               <button
                onClick={handleSaveAndExit}
                className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                Save & Exit
              </button>
              <button
                onClick={handleFinishWorkout}
                className="bg-neutral-900 hover:bg-neutral-700 text-neutral-50 dark:bg-neutral-100 dark:hover:bg-neutral-300 dark:text-neutral-900 font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
              >
                <Icon name="check"/>
                Finish Workout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;