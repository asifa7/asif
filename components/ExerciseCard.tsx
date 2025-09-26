import React, { useMemo, useState } from 'react';
import type { SessionExercise, SetEntry, WeightUnit } from '../types';
import SetRow from './SetRow';
import { getExerciseTip } from '../services/geminiService';
import Icon from './common/Icon';
import Modal from './common/Modal';

interface ExerciseCardProps {
  exercise: SessionExercise;
  unit: WeightUnit;
  onUpdateSet: (exerciseId: string, setId: string, newSetData: Partial<SetEntry>) => void;
  onAddSet: (exerciseId: string) => void;
  onRemoveSet: (exerciseId: string, setId: string) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, unit, onUpdateSet, onAddSet, onRemoveSet }) => {
  const [isTipModalOpen, setIsTipModalOpen] = useState(false);
  const [tip, setTip] = useState('');
  const [isLoadingTip, setIsLoadingTip] = useState(false);

  const handleGetTip = async () => {
    setIsTipModalOpen(true);
    setIsLoadingTip(true);
    const fetchedTip = await getExerciseTip(exercise.name);
    setTip(fetchedTip);
    setIsLoadingTip(false);
  };

  const exerciseVolume = useMemo(() => {
    return exercise.sets.reduce((total, set) => total + set.volume, 0);
  }, [exercise.sets]);

  return (
    <div className="bg-bunker-100 dark:bg-bunker-900 rounded-xl shadow-md overflow-hidden">
      <div className="p-4 bg-bunker-200 dark:bg-bunker-800 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-bunker-800 dark:text-bunker-100">{exercise.name}</h3>
          <p className="text-sm text-bunker-600 dark:text-bunker-400">Total Volume: {exerciseVolume.toLocaleString()} {unit}</p>
        </div>
        <button
          onClick={handleGetTip}
          className="bg-teal-500 text-white rounded-full h-10 w-10 flex items-center justify-center hover:bg-teal-600 transition-colors"
          title="Get AI Tip"
        >
          <Icon name="info" />
        </button>
      </div>

      <div className="p-4">
        <div className="grid grid-cols-5 gap-2 text-sm font-semibold text-bunker-600 dark:text-bunker-400 mb-2 px-2">
          <div className="col-span-1 text-center">Set</div>
          <div className="col-span-1 text-center">Reps</div>
          <div className="col-span-1 text-center">Weight ({unit})</div>
          <div className="col-span-1 text-center">Volume</div>
          <div className="col-span-1 text-center">Actions</div>
        </div>
        <div className="space-y-2">
          {exercise.sets.map((set, index) => (
            <SetRow
              key={set.id}
              set={set}
              setNumber={index + 1}
              unit={unit}
              onUpdate={(newSetData) => onUpdateSet(exercise.id, set.id, newSetData)}
              onRemove={() => onRemoveSet(exercise.id, set.id)}
            />
          ))}
        </div>
        <button
          onClick={() => onAddSet(exercise.id)}
          className="mt-4 w-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
        >
          <Icon name="plus" className="mr-2" />
          Add Set
        </button>
      </div>
      
      <Modal isOpen={isTipModalOpen} onClose={() => setIsTipModalOpen(false)} title={`Tip for ${exercise.name}`}>
        {isLoadingTip ? (
          <div className="flex items-center justify-center p-8">
            <Icon name="spinner" className="text-3xl text-teal-500" />
            <p className="ml-4">Getting tip from Gemini...</p>
          </div>
        ) : (
          <p className="text-bunker-700 dark:text-bunker-300 whitespace-pre-wrap">{tip}</p>
        )}
      </Modal>
    </div>
  );
};

export default ExerciseCard;