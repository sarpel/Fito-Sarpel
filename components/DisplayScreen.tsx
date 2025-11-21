
import React from 'react';
import { PlantAvatar } from './PlantAvatar';
import { MoodGif } from './MoodGif';
import { Droplets, Thermometer, Sun, Bell, Cpu, Leaf, Volume2 } from 'lucide-react';
import { PlantMood, PlantStage, SensorData, SensorThresholds, PlantSpecies } from '../types';

interface DisplayScreenProps {
  mood: PlantMood;
  sensorData: SensorData;
  thresholds: SensorThresholds;
  aiThought: string;
  isThinking: boolean;
  isSpeaking?: boolean;
  stage: PlantStage;
  nickname: string;
  currentSpecies: PlantSpecies | undefined;
  currentTime: string;
  isWateringDue: boolean;
  onManualSpeak?: () => void;
}

export const DisplayScreen: React.FC<DisplayScreenProps> = ({
  mood,
  sensorData,
  thresholds,
  aiThought,
  isThinking,
  isSpeaking = false,
  stage,
  nickname,
  currentSpecies,
  currentTime,
  isWateringDue,
  onManualSpeak
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
        <div className="relative z-10 flex justify-between items-center p-4 border-b border-gray-800/50 bg-gray-900/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Cpu size={14} />
            <span className={`w-2 h-2 rounded-full bg-green-500 ${isThinking ? 'animate-ping' : 'animate-pulse'}`}></span>
          </div>

          {/* Center System Time */}
          <div className="flex-1 text-center">
             <span className="font-mono-display text-4xl text-green-500 tracking-widest drop-shadow-lg opacity-90">
               {currentTime}
             </span>
          </div>

          {/* Current Species Badge */}
          <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-gray-400 bg-black/40 px-3 py-1.5 rounded-full border border-gray-700">
            <Leaf size={12} />
            {currentSpecies?.name.split(' ')[0] || "Plant"}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
          
          {/* Alerts */}
          {isWateringDue && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black px-6 py-2 rounded-full text-base font-bold flex items-center gap-2 animate-bounce shadow-lg border-2 border-yellow-200">
              <Bell size={20} />
              WATER ME!
            </div>
          )}

          {/* Nickname Display */}
          <div className="mb-6 flex flex-col items-center z-20">
            <h1 className="text-5xl font-bold text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] font-fredoka tracking-wide">
              {nickname}
            </h1>
          </div>

          {/* Plant Avatar Visualization */}
          <div className={`mb-8 transform scale-125 z-20 transition-transform duration-500 ${isSpeaking ? 'scale-[1.35]' : ''}`}>
            <PlantAvatar mood={mood} stage={stage} />
          </div>

          {/* Environmental Conditions (Stats) - Prominently displayed below Avatar */}
          <div className="flex items-center justify-center gap-6 mb-8 z-20">
            {/* Moisture */}
            <div className={`flex flex-col items-center p-3 rounded-xl backdrop-blur-md border min-w-[90px] transition-colors duration-300
              ${sensorData.moisture < thresholds.moisture.low || sensorData.moisture > thresholds.moisture.high 
                ? 'bg-red-500/20 border-red-500/50 text-red-200' 
                : 'bg-gray-900/60 border-white/10 text-blue-200'}`}
            >
              <Droplets size={20} className="mb-1 opacity-80" />
              <span className="text-lg font-mono font-bold">{sensorData.moisture}%</span>
              <span className="text-[10px] uppercase opacity-60">Moisture</span>
            </div>

            {/* Temperature */}
            <div className={`flex flex-col items-center p-3 rounded-xl backdrop-blur-md border min-w-[90px] transition-colors duration-300
              ${sensorData.temperature < thresholds.temperature.low || sensorData.temperature > thresholds.temperature.high 
                ? 'bg-red-500/20 border-red-500/50 text-red-200' 
                : 'bg-gray-900/60 border-white/10 text-orange-200'}`}
            >
              <Thermometer size={20} className="mb-1 opacity-80" />
              <span className="text-lg font-mono font-bold">{sensorData.temperature}°C</span>
              <span className="text-[10px] uppercase opacity-60">Temp</span>
            </div>

            {/* Light */}
            <div className={`flex flex-col items-center p-3 rounded-xl backdrop-blur-md border min-w-[90px] transition-colors duration-300
              ${sensorData.light < thresholds.light.low || sensorData.light > thresholds.light.high 
                ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200' 
                : 'bg-gray-900/60 border-white/10 text-yellow-200'}`}
            >
              <Sun size={20} className="mb-1 opacity-80" />
              <span className="text-lg font-mono font-bold">{sensorData.light}</span>
              <span className="text-[10px] uppercase opacity-60">Light</span>
            </div>
          </div>

          {/* AI Speech Bubble - Moved Below Stats */}
          <div className="z-30 w-full flex justify-center px-6">
             <div 
               onClick={onManualSpeak}
               className={`bg-white/95 text-gray-900 px-6 py-4 rounded-2xl shadow-2xl relative min-h-[90px] flex items-center justify-center max-w-lg border-2 cursor-pointer transition-all duration-300
                 ${isSpeaking ? 'border-green-400 scale-105 animate-pulse ring-4 ring-green-400/20' : 'border-gray-200 hover:scale-105 hover:border-green-200'}
               `}
             >
                {/* Arrow pointing UP towards the stats/plant */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-white/95 transform rotate-45 border-t-2 border-l-2 ${isSpeaking ? 'border-green-400' : 'border-gray-200'}`}></div>
                
                <div className="flex flex-col items-center gap-2 w-full">
                  <p className="font-mono-display text-2xl leading-tight text-center w-full">
                    {isThinking ? (
                      <span className="animate-pulse text-gray-500">Thinking...</span>
                    ) : (
                      aiThought
                    )}
                  </p>
                  
                  {/* Audio Visualizer */}
                  {isSpeaking && (
                    <div className="flex items-center justify-center gap-1 h-6 mt-2">
                       {[...Array(7)].map((_, i) => (
                         <div 
                            key={i} 
                            className="w-1.5 bg-green-500 rounded-full animate-pant" 
                            style={{ 
                                animationDuration: `${0.3 + (Math.random() * 0.3)}s`,
                                height: '100%' 
                            }}
                         ></div>
                       ))}
                    </div>
                  )}
                  
                  {/* Manual Speak Hint */}
                  {!isSpeaking && !isThinking && (
                    <div className="absolute -right-2 -bottom-2 bg-blue-500 text-white rounded-full p-2 shadow-md hover:bg-blue-600 transition-colors">
                      <Volume2 size={14} />
                    </div>
                  )}
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
