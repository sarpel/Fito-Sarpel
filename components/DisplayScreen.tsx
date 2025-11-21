
import React from 'react';
import { PlantAvatar } from './PlantAvatar';
import { SensorCard } from './SensorCard';
import { MoodGif } from './MoodGif';
import { Droplets, Thermometer, Sun, Bell, Cpu, Leaf } from 'lucide-react';
import { PlantMood, PlantStage, SensorData, SensorThresholds, WateringSchedule, PlantSpecies } from '../types';
import { CARE_TIPS } from '../constants';

interface DisplayScreenProps {
  mood: PlantMood;
  sensorData: SensorData;
  thresholds: SensorThresholds;
  aiThought: string;
  isThinking: boolean;
  stage: PlantStage;
  nickname: string;
  currentSpecies: PlantSpecies | undefined;
  currentTime: string;
  isWateringDue: boolean;
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  mood,
  sensorData,
  thresholds,
  aiThought,
  isThinking,
  stage,
  nickname,
  currentSpecies,
  currentTime,
  isWateringDue
}) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-0 relative overflow-hidden font-sans cursor-none select-none">
      
      {/* Background Ambient Glow */}
      <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 pointer-events-none 
        ${mood === 'happy' ? 'bg-green-500' : ''}
        ${mood === 'thirsty' ? 'bg-yellow-600' : ''}
        ${mood === 'drowning' ? 'bg-blue-700' : ''}
        ${mood === 'hot' || mood === 'scorched' ? 'bg-red-600' : ''}
        ${mood === 'freezing' ? 'bg-cyan-300' : ''}
        ${mood === 'dark' ? 'bg-gray-900' : ''}
        ${mood === 'sleeping' ? 'bg-indigo-950' : ''}
      `} />

      {/* Flickering Dark Mode Overlay */}
      {mood === 'dark' && (
         <div className="absolute inset-0 bg-black/40 animate-flicker pointer-events-none z-20 mix-blend-multiply"></div>
      )}

      {/* Sleeping Overlay */}
      {mood === 'sleeping' && (
         <div className="absolute inset-0 bg-indigo-950/60 pointer-events-none z-20 mix-blend-multiply"></div>
      )}

      {/* Main LCD Display Container - Full Screen for Pi */}
      <div className="w-full h-screen bg-black/60 flex flex-col relative">
        
        {/* Animated GIF Background Layer */}
        <MoodGif mood={mood} />

        {/* Header / Status Bar */}
        <div className="relative z-10 flex justify-between items-center p-3 border-b border-gray-800/50 bg-gray-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Cpu size={14} />
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>

          {/* Center System Time */}
          <div className="flex-1 text-center">
             <span className="font-mono-display text-3xl text-green-500 tracking-widest drop-shadow-lg opacity-90">
               {currentTime}
             </span>
          </div>

          {/* Current Species Badge */}
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400 bg-black/40 px-2 py-1 rounded-full border border-gray-700">
            <Leaf size={10} />
            {currentSpecies?.name.split(' ')[0] || "Plant"}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
          
          {/* Alerts */}
          {isWateringDue && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 animate-bounce shadow-lg border-2 border-yellow-200">
              <Bell size={16} />
              WATER ME!
            </div>
          )}

          {/* Nickname Display */}
          <div className="mb-4 flex flex-col items-center z-20">
            <h1 className="text-4xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-fredoka">
              {nickname}
            </h1>
          </div>

          {/* Plant Avatar Visualization */}
          <div className="mb-4 transform scale-125 z-20">
            <PlantAvatar mood={mood} stage={stage} />
          </div>

          {/* AI Speech Bubble - Moved Below Character */}
          <div className="z-30 w-full flex justify-center px-6 mt-6">
             <div className="bg-white/95 text-gray-900 p-4 rounded-2xl shadow-2xl animate-bounce-slow relative min-h-[80px] flex items-center justify-center max-w-md border-2 border-gray-200">
                {/* Arrow pointing UP towards the plant */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white/95 transform rotate-45 border-t-2 border-l-2 border-gray-200"></div>
                <p className="font-mono-display text-2xl leading-tight text-center">
                  {isThinking ? (
                    <span className="animate-pulse">Thinking...</span>
                  ) : (
                    aiThought
                  )}
                </p>
             </div>
          </div>
        </div>

        {/* Sensor Readings Grid - Bottom Dock */}
        <div className="relative z-10 grid grid-cols-3 gap-4 p-4 bg-gray-900/80 backdrop-blur-xl border-t border-gray-800 h-28">
          <SensorCard 
            icon={<Droplets size={24} />}
            label="Moist"
            value={sensorData.moisture}
            unit="%"
            status={sensorData.moisture < thresholds.moisture.low || sensorData.moisture > thresholds.moisture.high ? 'danger' : 'good'}
          />
          <SensorCard 
            icon={<Thermometer size={24} />}
            label="Temp"
            value={sensorData.temperature}
            unit="°C"
            status={sensorData.temperature < thresholds.temperature.low || sensorData.temperature > thresholds.temperature.high ? 'danger' : 'good'}
          />
          <SensorCard 
            icon={<Sun size={24} />}
            label="Light"
            value={sensorData.light}
            unit="lx"
            status={sensorData.light < thresholds.light.low || sensorData.light > thresholds.light.high ? 'warning' : 'good'}
          />
        </div>
      </div>
    </div>
  );
};
