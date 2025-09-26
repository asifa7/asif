
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Session, WeightUnit } from '../types';
import { WORKOUT_TEMPLATES } from '../constants';
import Icon from './common/Icon';

interface HistoryProps {
  unit: WeightUnit;
}

const History: React.FC<HistoryProps> = ({ unit }) => {
  const [sessions] = useLocalStorage<Session[]>('sessions', []);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  const toggleSessionDetails = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };
  
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Session ID,Date,Workout,Exercise,Set,Reps,Weight,Volume,Unit\n";

    sessions.forEach(session => {
        const template = WORKOUT_TEMPLATES.find(t => t.id === session.templateId);
        session.exercises.forEach(exercise => {
            exercise.sets.forEach((set, index) => {
                const row = [
                    session.id,
                    session.date,
                    template?.title || 'Custom Workout',
                    exercise.name,
                    index + 1,
                    set.reps,
                    set.weight,
                    set.volume,
                    session.unit,
                ].join(",");
                csvContent += row + "\r\n";
            });
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ppl_tracker_history.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const sortedSessions = [...sessions].sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold">Workout History</h2>
            <button
                onClick={exportToCSV}
                className="bg-teal-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2"
                disabled={sessions.length === 0}
            >
                <Icon name="download" /> Export to CSV
            </button>
        </div>

      {sortedSessions.length > 0 ? (
        <div className="space-y-4">
          {sortedSessions.map(session => {
            const template = WORKOUT_TEMPLATES.find(t => t.id === session.templateId);
            return (
              <div key={session.id} className="bg-bunker-100 dark:bg-bunker-900 rounded-lg shadow-md">
                <div 
                    className="p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => toggleSessionDetails(session.id)}
                >
                    <div>
                        <p className="font-bold text-lg">{template?.title || 'Custom Workout'}</p>
                        <p className="text-sm text-bunker-600 dark:text-bunker-400">
                            {new Date(session.completedAt).toLocaleDateString()} - Total Volume: {session.totalVolume.toLocaleString()} {session.unit}
                        </p>
                    </div>
                    <Icon name={expandedSessionId === session.id ? "chevronUp" : "chevronDown"} className="text-xl"/>
                </div>
                {expandedSessionId === session.id && (
                    <div className="border-t border-bunker-200 dark:border-bunker-800 p-4">
                        {session.exercises.map(ex => (
                            <div key={ex.id} className="mb-3">
                                <p className="font-semibold">{ex.name}</p>
                                <ul className="list-disc list-inside text-sm text-bunker-700 dark:text-bunker-300 pl-2">
                                    {ex.sets.map((set, index) => (
                                        <li key={set.id}>
                                            Set {index + 1}: {set.reps} reps @ {set.weight} {session.unit} (Volume: {set.volume})
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 px-6 bg-bunker-100 dark:bg-bunker-900 rounded-lg">
          <Icon name="history" className="text-5xl text-bunker-400 mb-4" />
          <h3 className="text-xl font-semibold">No Workouts Yet</h3>
          <p className="text-bunker-500 mt-2">Complete your first workout session to see it here.</p>
        </div>
      )}
    </div>
  );
};

export default History;
