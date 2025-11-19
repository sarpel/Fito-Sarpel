import React from 'react';

interface SensorCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'danger';
}

export const SensorCard: React.FC<SensorCardProps> = ({ icon, label, value, unit, status }) => {
  const getColor = () => {
    switch (status) {
      case 'good': return 'bg-green-500/20 border-green-500/50 text-green-400';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400';
      case 'danger': return 'bg-red-500/20 border-red-500/50 text-red-400';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border backdrop-blur-sm transition-colors duration-300 ${getColor()}`}>
      <div className="mb-1 opacity-80">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
      <span className="text-xl font-mono font-bold tracking-tight">
        {value}
        <span className="text-xs ml-0.5 opacity-60 font-sans">{unit}</span>
      </span>
    </div>
  );
};