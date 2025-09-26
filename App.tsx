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
import { EXERCISES, WORKOUT_TEMPLATES } from './constants';
import type { DailyChecklist as DailyChecklistType, WorkoutTemplate, WeightUnit, Session, SessionExercise, SetEntry } from './types';
import Icon from './components/common/Icon';

type View = 'calendar' | 'dashboard' | 'daily' | 'history' | 'settings' | 'session';

const App: React.FC = () => {
  const [view, setView] = useState<View>('calendar');
  const [sessions, setSessions] = useLocalStorage<Session[]>('sessions', []);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
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
  const [workoutSelectionDate, setWorkoutSelectionDate] = useState<string | null>(null);
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

  const handleStartWorkoutRequest = (date: string) => {
    const dayName = new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long' });
    setSuggestedTemplate(WORKOUT_TEMPLATES.find(t => t.dayOfWeek === dayName));
    setWorkoutSelectionDate(date);
    setWorkoutSelectionOpen(true);
  };
  
  const handleEditSession = (sessionId: string) => {
    setActiveSessionId(sessionId);
    setView('session');
  };

  const handleWorkoutSelected = (template: WorkoutTemplate) => {
    if (!workoutSelectionDate) return;

    const initialExercises = template.exercises.map(templateExercise => {
      const exerciseDetails = EXERCISES.find(e => e.id === templateExercise.exerciseId);
      if (!exerciseDetails) return null;
      const sets: SetEntry[] = Array.from({ length: templateExercise.defaultSets }, (_, i) => ({
        id: `set-${Date.now()}-${i}`, reps: 0, weight: 0, volume: 0,
      }));
      return { ...exerciseDetails, sets };
    }).filter((ex): ex is SessionExercise => ex !== null);
    
    const newSession: Session = {
      id: `session-${Date.now()}`,
      date: workoutSelectionDate,
      templateId: template.id,
      exercises: initialExercises,
      totalVolume: 0,
      unit: unit,
      status: 'in-progress'
    };
    
    setSessions(prev => [...prev, newSession]);
    setActiveSessionId(newSession.id);
    setWorkoutSelectionOpen(false);
    setView('session');
  };

  const exitSession = () => {
    setActiveSessionId(null);
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
        return activeSessionId && <WorkoutSession sessionId={activeSessionId} onExit={exitSession} unit={unit} />;
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
        return <CalendarView onStartWorkoutRequest={handleStartWorkoutRequest} onEditSession={handleEditSession}/>;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-sans transition-colors duration-300">
      <div className="container mx-auto px-4 pb-28">
        <header className="py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            <Icon name="dumbbell" className="mr-2" /> PPL Tracker
          </h1>
          <nav className="flex items-center space-x-2 sm:space-x-4">
             {navItems.map(item => (
                <button 
                  key={item.view}
                  onClick={() => setView(item.view)} 
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === item.view ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100' : 'hover:bg-neutral-200 dark:hover:bg-neutral-800'}`}
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