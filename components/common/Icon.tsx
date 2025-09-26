import React from 'react';

interface IconProps {
  name: string;
  className?: string;
}

const ICONS_MAP: { [key: string]: string } = {
  dumbbell: 'fas fa-dumbbell',
  calendar: 'fas fa-calendar-alt',
  history: 'fas fa-history',
  settings: 'fas fa-cog',
  water: 'fas fa-tint',
  creatine: 'fas fa-pills',
  fishOil: 'fas fa-oil-can',
  multivitamin: 'fas fa-capsules',
  check: 'fas fa-check-circle',
  plus: 'fas fa-plus',
  trash: 'fas fa-trash',
  edit: 'fas fa-pencil-alt',
  info: 'fas fa-info-circle',
  spinner: 'fas fa-spinner fa-spin',
  download: 'fas fa-download',
  chevronDown: 'fas fa-chevron-down',
  chevronUp: 'fas fa-chevron-up',
  chevronLeft: 'fas fa-chevron-left',
  chevronRight: 'fas fa-chevron-right',
  dashboard: 'fas fa-th-large',
  chartBar: 'fas fa-chart-bar',
  balance: 'fas fa-balance-scale',
  lightbulb: 'fas fa-lightbulb',
  checklist: 'fas fa-clipboard-check',
};

const Icon: React.FC<IconProps> = ({ name, className }) => {
  const iconClass = ICONS_MAP[name] || 'fas fa-question-circle';
  return <i className={`${iconClass} ${className || ''}`}></i>;
};

export default Icon;