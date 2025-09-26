import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { WORKOUT_TEMPLATES } from '../constants';
import type { WorkoutTemplate, Session, DayOfWeek } from '../types';
import Icon from './common/Icon';

interface CalendarViewProps {
  onStartWorkoutRequest: (date: string) => void;
  onEditSession: (sessionId: string) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ onStartWorkoutRequest, onEditSession }) => {
  const [sessions] = useLocalStorage<Session[]>('sessions', []);
  const [currentDate, setCurrentDate] = useState(new Date());

  const sessionMap = useMemo(() => {
    const map = new Map<string, Session[]>();
    sessions.forEach(s => {
      const dateSessions = map.get(s.date) || [];
      dateSessions.push(s);
      map.set(s.date, dateSessions);
    });
    return map;
  }, [sessions]);

  const changeMonth = (amount: number) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + amount);
      return newDate;
    });
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 bg-neutral-100 dark:bg-neutral-900 rounded-t-lg">
      <button onClick={() => changeMonth(-1)} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800" aria-label="Previous month">
        <Icon name="chevronLeft" />
      </button>
      <h2 className="text-xl font-bold">
        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </h2>
      <button onClick={() => changeMonth(1)} className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800" aria-label="Next month">
        <Icon name="chevronRight" />
      </button>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 gap-2 p-2">
        {days.map(day => (
          <div key={day} className="text-center font-semibold text-neutral-600 dark:text-neutral-400 text-sm">{day}</div>
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
          const daySessions = sessionMap.get(dateString) || [];
          
          const dayName = d.toLocaleDateString('en-US', { weekday: 'long' }) as DayOfWeek;
          const template = WORKOUT_TEMPLATES.find(t => t.dayOfWeek === dayName);

          return (
            <div
              key={i}
              className={`h-24 sm:h-32 p-2 border rounded-md flex flex-col justify-between transition-colors ${
                isCurrentMonth ? 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800' : 'bg-neutral-200/30 dark:bg-neutral-950/50 border-transparent text-neutral-400'
              } ${isToday ? 'border-2 border-neutral-800 dark:border-neutral-200' : ''}`}
            >
              <span className={`font-semibold text-sm ${isToday ? 'text-neutral-800 dark:text-neutral-200' : ''}`}>{d.getDate()}</span>
              <div className="flex flex-col items-center justify-center flex-grow space-y-1">
                {daySessions.map(session => (
                  <button key={session.id} onClick={() => onEditSession(session.id)} className="flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400" title={`Edit ${session.status} workout`}>
                     <Icon name={session.status === 'completed' ? 'check' : 'edit'} className={session.status === 'completed' ? 'text-neutral-600 dark:text-neutral-400' : 'text-neutral-500'}/>
                     <span>{session.totalVolume > 0 ? session.totalVolume.toLocaleString() : '...'}</span>
                  </button>
                ))}
                {template && daySessions.length === 0 && (
                    <button 
                        onClick={() => onStartWorkoutRequest(dateString)} 
                        className="bg-neutral-800 text-neutral-50 dark:bg-neutral-200 dark:text-neutral-900 rounded-full h-8 w-8 font-bold hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors flex items-center justify-center mx-auto" 
                        aria-label={`Log workout for ${dateString}`}
                    >
                        <Icon name="plus" className="text-lg" />
                    </button>
                )}
              </div>
               <div className="text-xs text-center text-neutral-500 truncate h-4">{template?.title.split(' ')[0]}</div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-neutral-950 shadow-lg rounded-lg">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};

export default CalendarView;