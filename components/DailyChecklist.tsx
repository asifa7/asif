import React from 'react';
import type { DailyChecklist as DailyChecklistType } from '../types';
import Icon from './common/Icon';

interface DailyChecklistProps {
  data: DailyChecklistType;
  setData: (data: DailyChecklistType) => void;
}

const DailyChecklist: React.FC<DailyChecklistProps> = ({ data, setData }) => {
  const totalWaterGlasses = 8;
  const waterPerGlass = 500;
  const currentGlasses = data.waterMl / waterPerGlass;

  const handleWaterClick = (index: number) => {
    const clickedGlasses = index + 1;
    const newWaterMl = data.waterMl === clickedGlasses * waterPerGlass ? (clickedGlasses - 1) * waterPerGlass : clickedGlasses * waterPerGlass;
    setData({ ...data, waterMl: newWaterMl });
  };

  const handleLogWater = () => {
    setData({ ...data, waterLogged: true });
  };

  const handleEditWater = () => {
    setData({ ...data, waterLogged: false });
  };
  
  const toggleSupplement = (supplement: 'creatineTaken' | 'fishOilTaken' | 'multivitaminTaken') => {
    setData({ ...data, [supplement]: !data[supplement] });
  };

  const supplements = [
    { key: 'creatineTaken', name: 'Creatine', icon: 'creatine' },
    { key: 'fishOilTaken', name: 'Fish Oil', icon: 'fishOil' },
    { key: 'multivitaminTaken', name: 'Multivitamin', icon: 'multivitamin' },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Daily Checklist</h2>
      <div className="space-y-6">
        {/* Water Intake Card */}
        <div className="bg-bunker-100 dark:bg-bunker-900 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Icon name="water" className="mr-3 text-blue-500" />
              Water Intake
            </h3>
            <span className="text-lg font-bold text-blue-500">{data.waterMl} / 4000 ml</span>
          </div>

          {data.waterLogged ? (
            <div className="h-16 flex items-center justify-between bg-bunker-200/50 dark:bg-bunker-800/50 rounded-md px-4">
              <p className="font-semibold text-green-600 dark:text-green-400 flex items-center">
                <Icon name="check" className="mr-2" /> Logged for today!
              </p>
              <button onClick={handleEditWater} className="text-bunker-600 dark:text-bunker-400 hover:text-blue-500 font-semibold flex items-center gap-2 py-2 px-3 rounded-md hover:bg-bunker-200 dark:hover:bg-bunker-800">
                <Icon name="edit" /> Edit
              </button>
            </div>
          ) : (
            <div>
              <div className="flex gap-2">
                {Array.from({ length: totalWaterGlasses }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleWaterClick(index)}
                    className={`flex-1 h-4 rounded-full transition-all duration-300 ${index < currentGlasses ? 'bg-blue-500' : 'bg-bunker-300 dark:bg-bunker-700'}`}
                    aria-label={`Set water intake to ${(index + 1) * waterPerGlass}ml`}
                  ></button>
                ))}
              </div>
              <button
                onClick={handleLogWater}
                disabled={data.waterMl === 0}
                className="mt-4 w-full text-md font-bold py-2 px-4 rounded-md transition-colors bg-blue-500 text-white hover:bg-blue-600 disabled:bg-bunker-300 dark:disabled:bg-bunker-700 disabled:cursor-not-allowed"
              >
                Log Water
              </button>
            </div>
          )}
        </div>

        {/* Supplements Card */}
        <div className="bg-bunker-100 dark:bg-bunker-900 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Supplements</h3>
          <div className="flex justify-around items-center gap-4">
            {supplements.map(sup => (
              <button
                key={sup.key}
                onClick={() => toggleSupplement(sup.key)}
                className={`flex-1 flex flex-col items-center gap-2 py-3 rounded-lg transition-all duration-300 font-medium ${data[sup.key] ? 'bg-green-500 text-white' : 'bg-bunker-200 dark:bg-bunker-800 hover:bg-bunker-300 dark:hover:bg-bunker-700'}`}
              >
                <Icon name={sup.icon} className="text-2xl" />
                <span>{sup.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChecklist;