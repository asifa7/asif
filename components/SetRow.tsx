import React from 'react';
import type { SetEntry, WeightUnit } from '../types';
import Icon from './common/Icon';

interface SetRowProps {
  set: SetEntry;
  setNumber: number;
  unit: WeightUnit;
  onUpdate: (newSetData: Partial<SetEntry>) => void;
  onRemove: () => void;
}

const SetRow: React.FC<SetRowProps> = ({ set, setNumber, unit, onUpdate, onRemove }) => {
  const kgSuggestions = [5, 7.5, 10, 12.5, 15, 20];
  const lbsSuggestions = [10, 15, 20, 25, 30, 45];
  const suggestions = unit === 'kg' ? kgSuggestions : lbsSuggestions;

  const handleInputChange = (field: 'reps' | 'weight', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0) {
      onUpdate({ [field]: numValue });
    } else if (value === '') {
      onUpdate({ [field]: 0 });
    }
  };

  const toggleCompleted = () => {
    onUpdate({ isCompleted: !set.isCompleted });
  };

  return (
    <div className={`p-2 rounded-lg transition-colors ${set.isCompleted ? 'bg-green-100 dark:bg-green-900/30' : 'bg-bunker-200 dark:bg-bunker-800/50'}`}>
      <div className="grid grid-cols-5 gap-2 items-center">
        <div className="col-span-1 text-center font-bold text-bunker-700 dark:text-bunker-300">{setNumber}</div>
        <div className="col-span-1">
          <input
            type="number"
            value={set.reps === 0 ? '' : set.reps}
            onChange={(e) => handleInputChange('reps', e.target.value)}
            className="w-full bg-bunker-50 dark:bg-bunker-700 text-center rounded-md p-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div className="col-span-1">
          <input
            type="number"
            step="2.5"
            value={set.weight === 0 ? '' : set.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
            className="w-full bg-bunker-50 dark:bg-bunker-700 text-center rounded-md p-2 border-transparent focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div className="col-span-1 text-center font-mono text-bunker-700 dark:text-bunker-300">{set.volume.toLocaleString()}</div>
        <div className="col-span-1 flex justify-center items-center gap-2">
          <button onClick={toggleCompleted} className={`transition-colors ${set.isCompleted ? 'text-green-500' : 'text-bunker-400 hover:text-green-500'}`}>
            <Icon name="check" />
          </button>
          <button onClick={onRemove} className="text-bunker-400 hover:text-red-500 transition-colors">
            <Icon name="trash" />
          </button>
        </div>
      </div>
      {!set.isCompleted && set.weight === 0 && (
        <div className="mt-2 flex flex-wrap gap-1.5 justify-center items-center px-1">
          <span className="text-xs self-center mr-1 text-bunker-500">Quick Add:</span>
          {suggestions.map(w => (
            <button
              key={w}
              onClick={() => onUpdate({ weight: w })}
              className="text-xs px-2.5 py-1 rounded-full bg-bunker-300 dark:bg-bunker-700 text-bunker-700 dark:text-bunker-200 hover:bg-blue-500 hover:text-white transition-colors"
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SetRow;