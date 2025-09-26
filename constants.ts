
import type { WorkoutTemplate, Exercise } from './types';

export const EXERCISES: Exercise[] = [
  { id: 'ex1', name: 'Flat Barbell Bench Press', muscleGroup: 'Chest' },
  { id: 'ex2', name: 'Incline Dumbbell Press', muscleGroup: 'Chest' },
  { id: 'ex3', name: 'Overhead Barbell Press', muscleGroup: 'Shoulders' },
  { id: 'ex4', name: 'Dumbbell Lateral Raises', muscleGroup: 'Shoulders' },
  { id: 'ex5', name: 'Cable Tricep Pushdowns', muscleGroup: 'Triceps' },
  { id: 'ex6', name: 'Overhead Tricep Extensions', muscleGroup: 'Triceps' },
  { id: 'ex7', name: 'Push-Ups', muscleGroup: 'Chest' },
  { id: 'ex8', name: 'Deadlifts', muscleGroup: 'Back' },
  { id: 'ex9', name: 'Pull-Ups', muscleGroup: 'Back' },
  { id: 'ex10', name: 'Lat Pulldown', muscleGroup: 'Back' },
  { id: 'ex11', name: 'Barbell Rows', muscleGroup: 'Back' },
  { id: 'ex12', name: 'Face Pulls', muscleGroup: 'Shoulders' },
  { id: 'ex13', name: 'Barbell Bicep Curls', muscleGroup: 'Biceps' },
  { id: 'ex14', name: 'Incline Dumbbell Curls', muscleGroup: 'Biceps' },
  { id: 'ex15', name: 'Back Squats', muscleGroup: 'Legs' },
  { id: 'ex16', name: 'Romanian Deadlifts', muscleGroup: 'Legs' },
  { id: 'ex17', name: 'Leg Press', muscleGroup: 'Legs' },
  { id: 'ex18', name: 'Walking Lunges', muscleGroup: 'Legs' },
  { id: 'ex19', name: 'Hanging Leg Raises', muscleGroup: 'Core' },
  { id: 'ex20', name: 'Plank with Side Twists', muscleGroup: 'Core' },
  { id: 'ex21', name: 'Incline Barbell Bench Press', muscleGroup: 'Chest' },
  { id: 'ex22', name: 'Flat Dumbbell Press', muscleGroup: 'Chest' },
  { id: 'ex23', name: 'Barbell Pendlay Rows', muscleGroup: 'Back' },
  { id: 'ex24', name: 'Dumbbell Chest Flys', muscleGroup: 'Chest' },
  { id: 'ex25', name: 'Cable Lat Pullover', muscleGroup: 'Back' },
  { id: 'ex26', name: 'Bar Dips', muscleGroup: 'Triceps' },
  { id: 'ex27', name: 'Skull Crushers (EZ Bar)', muscleGroup: 'Triceps' },
  { id: 'ex28', name: 'Preacher Curls', muscleGroup: 'Biceps' },
  { id: 'ex29', name: 'Hammer Curls', muscleGroup: 'Biceps' },
  { id: 'ex30', name: 'Front Squats', muscleGroup: 'Legs' },
  { id: 'ex31', name: 'Bulgarian Split Squats', muscleGroup: 'Legs' },
  { id: 'ex32', name: 'Leg Extension (Machine)', muscleGroup: 'Legs' },
  { id: 'ex33', name: 'Hamstring Curls (Machine)', muscleGroup: 'Legs' },
  { id: 'ex34', name: 'Standing Calf Raises', muscleGroup: 'Legs' },
  { id: 'ex35', name: 'Seated Calf Raises', muscleGroup: 'Legs' },
  { id: 'ex36', name: 'Cable Woodchoppers', muscleGroup: 'Core' },
  { id: 'ex37', name: 'Weighted Decline Sit-Ups', muscleGroup: 'Core' },
];


export const WORKOUT_TEMPLATES: WorkoutTemplate[] = [
  {
    id: 'day1',
    dayOfWeek: 'Monday',
    title: 'Push (Chest, Shoulders, Triceps)',
    exercises: [
      { exerciseId: 'ex1', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex2', defaultSets: 2, defaultReps: '8-10' },
      { exerciseId: 'ex3', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex4', defaultSets: 4, defaultReps: '12-15' },
      { exerciseId: 'ex5', defaultSets: 2, defaultReps: '10-12' },
      { exerciseId: 'ex6', defaultSets: 2, defaultReps: '10-12' },
      { exerciseId: 'ex7', defaultSets: 2, defaultReps: 'Failure' },
    ]
  },
  {
    id: 'day2',
    dayOfWeek: 'Tuesday',
    title: 'Pull (Back, Biceps, Rear Delts)',
    exercises: [
      { exerciseId: 'ex8', defaultSets: 4, defaultReps: '6-8' },
      { exerciseId: 'ex9', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex11', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex12', defaultSets: 2, defaultReps: '12-15' },
      { exerciseId: 'ex13', defaultSets: 2, defaultReps: '10-12' },
      { exerciseId: 'ex14', defaultSets: 3, defaultReps: '8-10' },
    ]
  },
  {
    id: 'day3',
    dayOfWeek: 'Wednesday',
    title: 'Legs + Core',
    exercises: [
      { exerciseId: 'ex15', defaultSets: 4, defaultReps: '8-10' },
      { exerciseId: 'ex16', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex17', defaultSets: 2, defaultReps: '12-15' },
      { exerciseId: 'ex18', defaultSets: 3, defaultReps: '12-15' },
      { exerciseId: 'ex19', defaultSets: 4, defaultReps: '15-20' },
      { exerciseId: 'ex20', defaultSets: 3, defaultReps: '20' },
    ]
  },
  {
    id: 'day4',
    dayOfWeek: 'Thursday',
    title: 'Chest + Back',
    exercises: [
      { exerciseId: 'ex21', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex22', defaultSets: 2, defaultReps: '8-10' },
      { exerciseId: 'ex9', defaultSets: 4, defaultReps: '8-10' },
      { exerciseId: 'ex23', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex24', defaultSets: 3, defaultReps: '12-15' },
      { exerciseId: 'ex25', defaultSets: 2, defaultReps: '10-12' },
      { exerciseId: 'ex26', defaultSets: 2, defaultReps: 'Failure' },
    ]
  },
  {
    id: 'day5',
    dayOfWeek: 'Friday',
    title: 'Full Arms + Shoulders',
    exercises: [
      { exerciseId: 'ex5', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex27', defaultSets: 3, defaultReps: '10-12' },
      { exerciseId: 'ex28', defaultSets: 2, defaultReps: '10-12' },
      { exerciseId: 'ex14', defaultSets: 2, defaultReps: '8-10' },
      { exerciseId: 'ex29', defaultSets: 2, defaultReps: '10-12' },
      { exerciseId: 'ex4', defaultSets: 4, defaultReps: '12-15' },
      { exerciseId: 'ex12', defaultSets: 3, defaultReps: '12-15' },
    ]
  },
  {
    id: 'day6',
    dayOfWeek: 'Saturday',
    title: 'Legs + Core',
    exercises: [
      { exerciseId: 'ex30', defaultSets: 3, defaultReps: '8-10' },
      { exerciseId: 'ex31', defaultSets: 3, defaultReps: '12-15' },
      { exerciseId: 'ex32', defaultSets: 2, defaultReps: '12-15' },
      { exerciseId: 'ex33', defaultSets: 3, defaultReps: '10-12' },
      { exerciseId: 'ex34', defaultSets: 4, defaultReps: '15-20' },
      { exerciseId: 'ex35', defaultSets: 4, defaultReps: '15-20' },
      { exerciseId: 'ex36', defaultSets: 3, defaultReps: '15' },
      { exerciseId: 'ex37', defaultSets: 3, defaultReps: '15-20' },
    ]
  },
];
