
import React, { useMemo, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { Session, WeightUnit, WorkoutTemplate } from '../types';
import { EXERCISES, WORKOUT_TEMPLATES } from '../constants';
import { getWorkoutImprovementSuggestion } from '../services/geminiService';
import Icon from './common/Icon';
import BarChart from './common/Chart';

// Helper to get week number for a given date
const getWeekNumber = (d: Date): number => {
    d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
};

interface DashboardProps {
    unit: WeightUnit;
}

const Dashboard: React.FC<DashboardProps> = ({ unit }) => {
    const [sessions] = useLocalStorage<Session[]>('sessions', []);
    const [filter, setFilter] = useState<string>('overall'); // 'overall' or template.id
    const [aiInsight, setAiInsight] = useState('');
    const [isLoadingAiInsight, setIsLoadingAiInsight] = useState(false);

    const exerciseMuscleMap = useMemo(() => new Map(EXERCISES.map(e => [e.id, e.muscleGroup])), []);

    const overallAnalysis = useMemo(() => {
        // ... (rest of overall analysis logic remains the same)
        const weeklyVolume: { [week: string]: number } = {};
        const muscleVolume: { [group: string]: number } = {};
        
        const fourWeeksAgo = new Date();
        fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

        sessions
            .filter(s => new Date(s.completedAt) > fourWeeksAgo)
            .forEach(session => {
                const date = new Date(session.completedAt);
                const week = `${date.getFullYear()}-W${getWeekNumber(date)}`;
                
                weeklyVolume[week] = (weeklyVolume[week] || 0) + session.totalVolume;

                session.exercises.forEach(exercise => {
                    const muscleGroup = exerciseMuscleMap.get(exercise.id) || 'Unknown';
                    const exerciseVolume = exercise.sets.reduce((sum, set) => sum + set.volume, 0);
                    muscleVolume[muscleGroup] = (muscleVolume[muscleGroup] || 0) + exerciseVolume;
                });
        });

        const weeklyChartData = Object.entries(weeklyVolume)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([label, value]) => ({ label: label.split('-')[1], value }));
        
        const pushPullLegs = { Push: 0, Pull: 0, Legs: 0, Other: 0 };
        const pushGroups = ['Chest', 'Shoulders', 'Triceps'];
        const pullGroups = ['Back', 'Biceps'];
        const legGroups = ['Legs'];

        for(const [group, volume] of Object.entries(muscleVolume)) {
            if (pushGroups.includes(group)) pushPullLegs.Push += volume;
            else if (pullGroups.includes(group)) pushPullLegs.Pull += volume;
            else if (legGroups.includes(group)) pushPullLegs.Legs += volume;
            else pushPullLegs.Other += volume;
        }
        
        const totalPPLVolume = pushPullLegs.Push + pushPullLegs.Pull + pushPullLegs.Legs;
        const muscleBalanceData = totalPPLVolume > 0 ? [
            { label: 'Push', value: Math.round((pushPullLegs.Push / totalPPLVolume) * 100) },
            { label: 'Pull', value: Math.round((pushPullLegs.Pull / totalPPLVolume) * 100) },
            { label: 'Legs', value: Math.round((pushPullLegs.Legs / totalPPLVolume) * 100) },
        ] : [];
        
        let insight = "Keep up the great work! Your training seems balanced.";
        if (muscleBalanceData.length > 0) {
            const min = Math.min(...muscleBalanceData.map(d => d.value));
            const lagging = muscleBalanceData.find(d => d.value === min);
            if (lagging && lagging.value < 25) { // If any group is less than 25%
                insight = `Your ${lagging.label.toLowerCase()} volume is a bit lower than other areas. Consider focusing on your ${lagging.label} days to ensure balanced development.`;
            }
        } else if (sessions.length > 0) {
             insight = "You've recorded workouts, but not enough data in the last 4 weeks to analyze your PPL balance. Keep logging to unlock insights!";
        } else {
             insight = "Welcome to your dashboard! Complete a few workouts to see your progress and get personalized insights.";
        }

        return { weeklyChartData, muscleBalanceData, insight };
    }, [sessions, exerciseMuscleMap]);

    const detailedAnalysis = useMemo(() => {
        if (filter === 'overall') return null;

        const filteredSessions = sessions.filter(s => s.templateId === filter);
        if (filteredSessions.length === 0) return { totalSessions: 0 };
        
        const totalSessions = filteredSessions.length;
        const totalVolume = filteredSessions.reduce((sum, s) => sum + s.totalVolume, 0);
        const avgVolume = totalVolume / totalSessions;

        const exerciseStats: { [exId: string]: { name: string; totalSets: number; totalReps: number; totalWeight: number; maxWeight: number; count: number } } = {};

        filteredSessions.forEach(s => {
            s.exercises.forEach(ex => {
                if (!exerciseStats[ex.id]) {
                    exerciseStats[ex.id] = { name: ex.name, totalSets: 0, totalReps: 0, totalWeight: 0, maxWeight: 0, count: 0 };
                }
                ex.sets.forEach(set => {
                    if (set.reps > 0 && set.weight > 0) {
                        exerciseStats[ex.id].totalSets += 1;
                        exerciseStats[ex.id].totalReps += set.reps;
                        exerciseStats[ex.id].totalWeight += set.weight;
                        exerciseStats[ex.id].count +=1;
                        if (set.weight > exerciseStats[ex.id].maxWeight) {
                            exerciseStats[ex.id].maxWeight = set.weight;
                        }
                    }
                });
            });
        });

        return {
            totalSessions,
            avgVolume,
            exerciseStats: Object.values(exerciseStats),
            sessions: filteredSessions,
        };
    }, [sessions, filter]);
    
    const handleGetInsight = useCallback(async () => {
        if (!detailedAnalysis || !detailedAnalysis.sessions) return;
        setIsLoadingAiInsight(true);
        const template = WORKOUT_TEMPLATES.find(t => t.id === filter);
        const suggestion = await getWorkoutImprovementSuggestion(detailedAnalysis.sessions, template?.title || 'this workout');
        setAiInsight(suggestion);
        setIsLoadingAiInsight(false);
    }, [detailedAnalysis, filter]);

    if (sessions.length === 0) {
        return (
             <div className="text-center py-16 px-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                <Icon name="dashboard" className="text-5xl text-neutral-400 mb-4" />
                <h3 className="text-xl font-semibold">Dashboard is Empty</h3>
                <p className="text-neutral-500 mt-2">Start working out to see your stats and insights here.</p>
            </div>
        )
    }
    
    const activeTemplate = WORKOUT_TEMPLATES.find(t => t.id === filter);

    return (
        <div>
            <div className="mb-6 flex flex-wrap gap-2">
                <button onClick={() => setFilter('overall')} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === 'overall' ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700'}`}>
                    Overall Report
                </button>
                {WORKOUT_TEMPLATES.map(template => (
                    <button key={template.id} onClick={() => { setFilter(template.id); setAiInsight(''); }} className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${filter === template.id ? 'bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900' : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700'}`}>
                        {template.title}
                    </button>
                ))}
            </div>

            {filter === 'overall' ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-3 bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg">
                         <h3 className="text-xl font-semibold mb-4 flex items-center"><Icon name="lightbulb" className="mr-3 text-neutral-500"/> Overall Insight</h3>
                         <p className="text-neutral-600 dark:text-neutral-300">{overallAnalysis.insight}</p>
                    </div>
                    <div className="lg:col-span-2 bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><Icon name="chartBar" className="mr-3 text-neutral-500"/> Weekly Volume (Last 4 Weeks)</h3>
                        {overallAnalysis.weeklyChartData.length > 0 ? (
                            <BarChart data={overallAnalysis.weeklyChartData} barColor="bg-neutral-500" />
                        ) : <p className="text-neutral-500">Not enough data for weekly volume chart.</p>}
                    </div>
                    <div className="lg:col-span-1 bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg">
                        <h3 className="text-xl font-semibold mb-4 flex items-center"><Icon name="balance" className="mr-3 text-neutral-500"/> Muscle Group Balance</h3>
                        {overallAnalysis.muscleBalanceData.length > 0 ? (
                            <div className="space-y-4">
                                {overallAnalysis.muscleBalanceData.map(item => (
                                    <div key={item.label}>
                                        <div className="flex justify-between mb-1">
                                            <span className="font-semibold">{item.label}</span>
                                            <span>{item.value}%</span>
                                        </div>
                                        <div className="w-full bg-neutral-200 dark:bg-neutral-800 rounded-full h-4">
                                            <div className="bg-neutral-600 h-4 rounded-full" style={{ width: `${item.value}%` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                         ) : <p className="text-neutral-500">Not enough data for balance analysis.</p>}
                    </div>
                </div>
            ) : (
                detailedAnalysis && detailedAnalysis.totalSessions > 0 ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">AI-Powered Suggestion for {activeTemplate?.title}</h3>
                            {isLoadingAiInsight ? (
                                <div className="flex items-center text-neutral-500">
                                    <Icon name="spinner" className="mr-3"/> Analyzing your progress...
                                </div>
                            ) : aiInsight ? (
                                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-wrap">{aiInsight}</p>
                            ) : (
                                <button onClick={handleGetInsight} className="bg-neutral-800 hover:bg-neutral-700 text-neutral-100 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300 font-semibold py-2 px-4 rounded-lg transition-colors">
                                    Get Improvement Tip
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                             <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
                                <h4 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">Total Sessions</h4>
                                <p className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">{detailedAnalysis.totalSessions}</p>
                            </div>
                             <div className="bg-neutral-100 dark:bg-neutral-900 p-6 rounded-lg text-center">
                                <h4 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">Avg. Volume / Session</h4>
                                <p className="text-4xl font-bold text-neutral-800 dark:text-neutral-200">{Math.round(detailedAnalysis.avgVolume).toLocaleString()} <span className="text-2xl">{unit}</span></p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Exercise Performance</h3>
                            <div className="space-y-3">
                                {detailedAnalysis.exerciseStats.map(ex => (
                                    <div key={ex.name} className="bg-neutral-100 dark:bg-neutral-900 p-4 rounded-lg">
                                        <p className="font-bold text-lg">{ex.name}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-center">
                                            <div><p className="text-sm text-neutral-500">Total Sets</p><p className="font-semibold">{ex.totalSets}</p></div>
                                            <div><p className="text-sm text-neutral-500">Avg Reps</p><p className="font-semibold">{(ex.totalReps / ex.totalSets).toFixed(1)}</p></div>
                                            <div><p className="text-sm text-neutral-500">Avg Weight ({unit})</p><p className="font-semibold">{(ex.totalWeight / ex.count).toFixed(1)}</p></div>
                                            <div><p className="text-sm text-neutral-500">Max Weight ({unit})</p><p className="font-semibold">{ex.maxWeight}</p></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-16 px-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg">
                        <Icon name="history" className="text-5xl text-neutral-400 mb-4" />
                        <h3 className="text-xl font-semibold">No Data for this Workout</h3>
                        <p className="text-neutral-500 mt-2">Complete a "{activeTemplate?.title}" session to see detailed stats here.</p>
                    </div>
                )
            )}
        </div>
    );
};

export default Dashboard;