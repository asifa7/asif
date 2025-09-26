import React from 'react';
import { WORKOUT_TEMPLATES } from '../constants';
import type { WorkoutTemplate } from '../types';
import Modal from './common/Modal';
import Icon from './common/Icon';

interface WorkoutSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (template: WorkoutTemplate) => void;
  suggestedTemplate?: WorkoutTemplate;
}

const WorkoutSelectionModal: React.FC<WorkoutSelectionModalProps> = ({ isOpen, onClose, onSelect, suggestedTemplate }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Workout">
      <div className="space-y-3">
        <p className="text-bunker-600 dark:text-bunker-400 mb-4">
          Select the workout you want to start for today.
        </p>
        {WORKOUT_TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="w-full text-left p-4 rounded-lg flex justify-between items-center transition-all duration-200 ease-in-out bg-bunker-200/50 dark:bg-bunker-800/50 hover:bg-bunker-200 dark:hover:bg-bunker-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <div>
              <p className="font-semibold text-bunker-800 dark:text-bunker-200">{template.title}</p>
              <p className="text-sm text-bunker-500">{template.dayOfWeek}</p>
            </div>
            {suggestedTemplate?.id === template.id && (
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                <Icon name="check" className="mr-1" /> Recommended
              </span>
            )}
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default WorkoutSelectionModal;
