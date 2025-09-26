
import { EXERCISES, WORKOUT_TEMPLATES } from '../constants';

export const seedInitialData = () => {
  if (!localStorage.getItem('exercises')) {
    localStorage.setItem('exercises', JSON.stringify(EXERCISES));
  }
  if (!localStorage.getItem('workout_templates')) {
    localStorage.setItem('workout_templates', JSON.stringify(WORKOUT_TEMPLATES));
  }
  if (!localStorage.getItem('sessions')) {
    localStorage.setItem('sessions', JSON.stringify([]));
  }
};
