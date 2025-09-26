
import React from 'react';
import type { WeightUnit } from '../types';

interface SettingsProps {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  unit: WeightUnit;
  setUnit: (unit: WeightUnit) => void;
}

const Settings: React.FC<SettingsProps> = ({ theme, setTheme, unit, setUnit }) => {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>
      
      <div className="space-y-6">
        {/* Theme Settings */}
        <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Appearance</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-3">Choose your preferred theme.</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 p-3 rounded-md text-center font-semibold transition-all ${theme === 'light' ? 'bg-neutral-900 text-neutral-50 ring-2 ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900 ring-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300'}`}
            >
              <i className="fas fa-sun mr-2"></i> Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 p-3 rounded-md text-center font-semibold transition-all ${theme === 'dark' ? 'bg-neutral-100 text-neutral-900 ring-2 ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900 ring-neutral-100' : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300'}`}
            >
              <i className="fas fa-moon mr-2"></i> Dark
            </button>
          </div>
        </div>

        {/* Unit Settings */}
        <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Units</h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-3">Select your preferred unit for weight.</p>
          <div className="flex space-x-4">
            <button
              onClick={() => setUnit('kg')}
              className={`flex-1 p-3 rounded-md text-center font-semibold transition-all ${unit === 'kg' ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 ring-2 ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900 ring-neutral-900 dark:ring-neutral-100' : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300'}`}
            >
              Kilograms (kg)
            </button>
            <button
              onClick={() => setUnit('lbs')}
              className={`flex-1 p-3 rounded-md text-center font-semibold transition-all ${unit === 'lbs' ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900 ring-2 ring-offset-2 ring-offset-neutral-100 dark:ring-offset-neutral-900 ring-neutral-900 dark:ring-neutral-100' : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300'}`}
            >
              Pounds (lbs)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;