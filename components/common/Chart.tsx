
import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface BarChartProps {
  data: ChartData[];
  barColor?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, barColor = 'bg-blue-500' }) => {
  const maxValue = Math.max(...data.map(d => d.value), 0);

  return (
    <div className="w-full h-64 flex items-end justify-around space-x-2 p-4 bg-bunker-200/50 dark:bg-bunker-800/50 rounded-lg">
      {data.map((item, index) => (
        <div key={index} className="flex-1 flex flex-col items-center h-full">
          <div className="w-full h-full flex items-end">
             <div
                className={`w-full ${barColor} rounded-t-md transition-all duration-500 ease-out`}
                style={{ height: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                title={`Volume: ${item.value.toLocaleString()}`}
              ></div>
          </div>
          <span className="text-xs font-semibold mt-2 text-bunker-600 dark:text-bunker-400">{item.label}</span>
        </div>
      ))}
    </div>
  );
};

export default BarChart;
