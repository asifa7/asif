import React, { useState, useEffect, useMemo } from 'react';
import type { WorkoutTemplate, SessionExercise, SetEntry, WeightUnit } from '../types';
import { EXERCISES } from '../constants';
import { useLocalStorage } from '../hooks/useLocalStorage';
import ExerciseCard from './ExerciseCard';
import Icon from './common/Icon';

interface WorkoutSessionProps {
  template: WorkoutTemplate;
  onComplete: () => void;
  unit: WeightUnit;
}

const WorkoutSession: React.FC<WorkoutSessionProps> = ({ template, onComplete, unit }) => {
  const [sessions, setSessions] = useLocalStorage<any[]>('sessions', []);
  const [exercises, setExercises] = useState<SessionExercise[]>([]);

  useEffect(() => {
    const initialExercises = template.exercises.map(templateExercise => {
      const exerciseDetails = EXERCISES.find(e => e.id === templateExercise.exerciseId);
      if (!exerciseDetails) return null;

      const sets: SetEntry[] = Array.from({ length: templateExercise.defaultSets }, (_, i) => ({
        id: `set-${Date.now()}-${i}`,
        reps: 0,
        weight: 0,
        volume: 0,
        isCompleted: false,
      }));

      return { ...exerciseDetails, sets };
    }).filter((ex): ex is SessionExercise => ex !== null);
    setExercises(initialExercises);
  }, [template]);

  const updateSet = (exerciseId: string, setId: string, newSetData: Partial<SetEntry>) => {
    setExercises(prevExercises =>
      prevExercises.map(ex => {
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
      })
    );
  };
  
  const addSet = (exerciseId: string) => {
    const newSet: SetEntry = { id: `set-${Date.now()}`, reps: 12, weight: 0, volume: 0, isCompleted: false };
    setExercises(prevExercises => prevExercises.map(ex => ex.id === exerciseId ? {...ex, sets: [...ex.sets, newSet]} : ex));
  };

  const removeSet = (exerciseId: string, setId: string) => {
    setExercises(prevExercises => prevExercises.map(ex => ex.id === exerciseId ? {...ex, sets: ex.sets.filter(s => s.id !== setId)} : ex));
  };
  
  const totalVolume = useMemo(() => {
      return exercises.reduce((total, ex) => total + ex.sets.reduce((exTotal, set) => exTotal + set.volume, 0), 0);
  }, [exercises]);

  const handleCompleteWorkout = () => {
    const newSession = {
      id: `session-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      templateId: template.id,
      completedAt: new Date().toISOString(),
      exercises: exercises,
      totalVolume: totalVolume,
      unit: unit,
    };
    setSessions([...sessions, newSession]);
    onComplete();
  };

  return (
    <div className="pb-24">
      <div className="mb-6 p-4 bg-bunker-100 dark:bg-bunker-900 rounded-lg">
        <h2 className="text-2xl font-bold text-bunker-800 dark:text-bunker-100">{template.title}</h2>
        <p className="text-bunker-600 dark:text-bunker-400">{template.dayOfWeek}</p>
      </div>

      <div className="space-y-6">
        {exercises.map(exercise => (
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
      
      <div className="fixed bottom-24 left-0 right-0 z-30">
        <div className="container mx-auto px-4">
          <div className="bg-bunker-800 text-white rounded-xl shadow-lg p-4 flex justify-between items-center">
            <div>
              <span className="text-sm text-bunker-300">Total Volume</span>
              <p className="text-2xl font-bold">{totalVolume.toLocaleString()} {unit}</p>
            </div>
            <button
              onClick={handleCompleteWorkout}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center gap-2"
            >
              <Icon name="check"/>
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutSession;