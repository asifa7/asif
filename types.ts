// FIX: Define DayOfWeek and WeightUnit types locally to resolve circular dependency and import error.
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
export type WeightUnit = 'kg' | 'lbs';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: string;
}

export interface TemplateExercise {
  exerciseId: string;
  defaultSets: number;
  defaultReps: string; // e.g., "8-10"
}

export interface WorkoutTemplate {
  id: string;
  dayOfWeek: DayOfWeek;
  title: string;
  exercises: TemplateExercise[];
}

export interface SetEntry {
  id: string;
  reps: number;
  weight: number;
  volume: number;
  isCompleted: boolean;
}

export interface SessionExercise extends Exercise {
  sets: SetEntry[];
}

export interface Session {
  id: string;
  date: string; // YYYY-MM-DD
  templateId: string;
  completedAt: string; // ISO string
  exercises: SessionExercise[];
  totalVolume: number;
  unit: WeightUnit;
}

export interface DailyChecklist {
  date: string; // YYYY-MM-DD
  waterMl: number;
  creatineTaken: boolean;
  fishOilTaken: boolean;
  multivitaminTaken: boolean;
  waterLogged: boolean;
}