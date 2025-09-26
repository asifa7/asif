import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import CalendarView from './components/CalendarView';
import WorkoutSession from './components/WorkoutSession';
import History from './components/History';
import Dashboard from './components/Dashboard';
import DailyChecklist from './components/DailyChecklist';
import Settings from './components/Settings';
import WorkoutSelectionModal from './components/WorkoutSelectionModal';
import { seedInitialData } from './services/dataService';
import type { DailyChecklist as DailyChecklistType, WorkoutTemplate, WeightUnit } from './types';
import Icon from './components/common/Icon';

type View = 'calendar' | 'dashboard' | 'daily' | 'history' | 'settings' | 'session';

const App: React.FC = () => {
  const [view, setView] = useState<View>('calendar');
  const [activeWorkout, setActiveWorkout] = useState<WorkoutTemplate | null>(null);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'dark');
  const [unit, setUnit] = useLocalStorage<WeightUnit>('unit', 'kg');
  const [checklistData, setChecklistData] = useLocalStorage<DailyChecklistType>('dailyChecklist', {
    date: new Date().toISOString().split('T')[0],
    waterMl: 0,
    creatineTaken: false,
    fishOilTaken: false,
    multivitaminTaken: false,
    waterLogged: false,
  });
  const [isWorkoutSelectionOpen, setWorkoutSelectionOpen] = useState(false);
  const [suggestedTemplate, setSuggestedTemplate] = useState<WorkoutTemplate | undefined>(undefined);

  useEffect(() => {
    seedInitialData();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const resetChecklistIfNeeded = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    if (checklistData.date !== today) {
      setChecklistData({
        date: today,
        waterMl: 0,
        creatineTaken: false,
        fishOilTaken: false,
        multivitaminTaken: false,
        waterLogged: false,
      });
    }
  }, [checklistData.date, setChecklistData]);

  useEffect(() => {
    resetChecklistIfNeeded();
    const interval = setInterval(resetChecklistIfNeeded, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [resetChecklistIfNeeded]);

  const handleStartWorkoutRequest = (template: WorkoutTemplate) => {
    setSuggestedTemplate(template);
    setWorkoutSelectionOpen(true);
  };

  const handleWorkoutSelected = (template: WorkoutTemplate) => {
    setWorkoutSelectionOpen(false);
    setActiveWorkout(template);
    setView('session');
  };

  const completeWorkout = () => {
    setActiveWorkout(null);
    setView('calendar');
  };
  
  const navItems: { view: View; icon: string; label: string }[] = [
    { view: 'calendar', icon: 'calendar', label: 'Calendar' },
    { view: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { view: 'daily', icon: 'checklist', label: 'Daily' },
    { view: 'history', icon: 'history', label: 'History' },
    { view: 'settings', icon: 'settings', label: 'Settings' },
  ];

  const renderContent = () => {
    switch (view) {
      case 'session':
        return activeWorkout && <WorkoutSession template={activeWorkout} onComplete={completeWorkout} unit={unit} />;
      case 'history':
        return <History unit={unit} />;
      case 'dashboard':
        return <Dashboard unit={unit} />;
      case 'settings':
        return <Settings theme={theme} setTheme={setTheme} unit={unit} setUnit={setUnit} />;
      case 'daily':
        return <DailyChecklist data={checklistData} setData={setChecklistData} />;
      case 'calendar':
      default:
        return <CalendarView onStartWorkout={handleStartWorkoutRequest} />;
    }
  };

  return (
    <div className="min-h-screen bg-bunker-50 dark:bg-bunker-950 text-bunker-800 dark:text-bunker-200 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 pb-32">
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-400">
            <Icon name="dumbbell" className="mr-2" /> PPL Tracker
          </h1>
          <nav className="flex items-center space-x-2 sm:space-x-4">
             {navItems.map(item => (
                <button 
                  key={item.view}
                  onClick={() => setView(item.view)} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === item.view ? 'bg-bunker-200 dark:bg-bunker-800 text-blue-500' : 'hover:bg-bunker-200 dark:hover:bg-bunker-800'}`}
                  aria-label={item.label}
                >
                  <Icon name={item.icon} />
                  <span className="hidden sm:inline ml-2">{item.label}</span>
                </button>
             ))}
          </nav>
        </header>
        <main>{renderContent()}</main>
      </div>
      <WorkoutSelectionModal
        isOpen={isWorkoutSelectionOpen}
        onClose={() => setWorkoutSelectionOpen(false)}
        onSelect={handleWorkoutSelected}
        suggestedTemplate={suggestedTemplate}
      />
    </div>
  );
};

export default App;