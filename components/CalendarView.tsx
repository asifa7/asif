import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WORKOUT_TEMPLATES } from '../constants';
import type { WorkoutTemplate, Session, DayOfWeek } from '../types';
import Icon from './common/Icon';

interface CalendarViewProps {
  onStartWorkout: (template: WorkoutTemplate) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onStartWorkout }) => {
  const [sessions] = useLocalStorage<Session[]>('sessions', []);
  const [currentDate, setCurrentDate] = useState(new Date());

  const completedSessionMap = new Map(sessions.map(s => [s.date, s]));

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 bg-bunker-100 dark:bg-bunker-900 rounded-t-lg">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-bunker-200 dark:hover:bg-bunker-800" aria-label="Previous month">
        <Icon name="chevronLeft" />
      </button>
      <h2 className="text-xl font-bold">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-bunker-200 dark:hover:bg-bunker-800" aria-label="Next month">
        <Icon name="chevronRight" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-2 p-2">
        {days.map(day => (
          <div key={day} className="text-center font-semibold text-bunker-600 dark:text-bunker-400 text-sm">{day}</div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    startDate.setDate(startDate.getDate() - monthStart.getDay());
    const endDate = new Date(monthEnd);
    endDate.setDate(endDate.getDate() + (6 - monthEnd.getDay()));

    const days = [];
    let day = startDate;
    while (day <= endDate) {
      days.push(new Date(day));
      day.setDate(day.getDate() + 1);
    }
    
    const today = new Date();
    today.setHours(0,0,0,0);

    return (
      <div className="grid grid-cols-7 gap-1 sm:gap-2 p-2">
        {days.map((d, i) => {
          const dateString = d.toISOString().split('T')[0];
          const isCurrentMonth = d.getMonth() === currentDate.getMonth();
          const isToday = d.getTime() === today.getTime();
          const session = completedSessionMap.get(dateString);
          
          const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
          const template = WORKOUT_TEMPLATES.find(t => t.dayOfWeek === dayName);
          
          const canStartWorkout = !session && d >= today;

          return (
            <div
              key={i}
              className={`h-24 sm:h-32 p-2 border rounded-md flex flex-col justify-between transition-colors ${
                isCurrentMonth ? 'bg-bunker-50 dark:bg-bunker-900 border-bunker-200 dark:border-bunker-800' : 'bg-bunker-200/30 dark:bg-bunker-950/50 border-transparent text-bunker-400'
              } ${isToday ? 'border-2 border-blue-500' : ''}`}
            >
              <span className={`font-semibold text-sm ${isToday ? 'text-blue-500' : ''}`}>{d.getDate()}</span>
              <div className="text-center">
                {session && (
                  <div className="flex flex-col items-center">
                     <Icon name="check" className="text-green-500 text-lg mb-1"/>
                     <span className="text-xs font-bold text-green-500">{session.totalVolume.toLocaleString()}</span>
                     <span className="text-xs text-bunker-500">{session.unit}</span>
                  </div>
                )}
                {canStartWorkout && (
                    <button onClick={() => onStartWorkout(template!)} className="bg-blue-600 text-white rounded-full h-8 w-8 text-xs font-bold hover:bg-blue-700 transition-colors" aria-label={`Start workout for ${dateString}`}>
                        Start
                    </button>
                )}
              </div>
               <div className="text-xs text-center text-bunker-500 truncate">{template?.title.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-bunker-950 shadow-lg rounded-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;
