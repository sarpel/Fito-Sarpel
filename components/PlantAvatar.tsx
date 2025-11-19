import React from 'react';
import { PlantMood } from '../types';

interface PlantAvatarProps {
  mood: PlantMood;
}

export const PlantAvatar: React.FC<PlantAvatarProps> = ({ mood }) => {
  
  // Dynamic classes based on mood
  const getFaceExpression = () => {
    switch (mood) {
      case 'happy': return {
        eyes: 'h-3 w-3 bg-black rounded-full',
        mouth: 'w-8 h-4 border-b-4 border-black rounded-full mt-1',
        container: 'animate-bounce-slow'
      };
      case 'thirsty': return {
        eyes: 'h-3 w-3 bg-black rounded-full opacity-50',
        mouth: 'w-6 h-4 border-t-4 border-black rounded-full mt-2', // Frown
        container: 'animate-pulse' // Weak pulse
      };
      case 'drowning': return {
        eyes: 'h-4 w-4 bg-blue-900 rounded-full', // Wide eyes
        mouth: 'w-2 h-2 bg-black rounded-full mt-2', // Gasp
        container: 'translate-y-4' // Sinking
      };
      case 'hot': return {
        eyes: 'h-1 w-4 bg-black mt-2', // Squinting
        mouth: 'w-6 h-6 border-4 border-black rounded-full mt-1', // Panting
        container: 'animate-shake' // Shaking from heat
      };
      case 'freezing': return {
        eyes: 'h-3 w-3 bg-blue-400 rounded-full',
        mouth: 'w-6 h-1 bg-black mt-2', // Chattering
        container: 'animate-shiver'
      };
      case 'dark': return {
        eyes: 'h-4 w-4 bg-yellow-400 rounded-full animate-blink', // Night vision
        mouth: 'w-4 h-1 bg-white/50 mt-2',
        container: 'opacity-50'
      };
      case 'scorched': return {
        eyes: 'h-1 w-4 bg-black rotate-12', // Dizzy
        mouth: 'w-6 h-2 bg-black -rotate-6 mt-2',
        container: ''
      };
      default: return {
        eyes: 'h-3 w-3 bg-black rounded-full',
        mouth: 'w-6 h-1 bg-black rounded mt-2',
        container: ''
      };
    }
  };

  const expr = getFaceExpression();

  return (
    <div className={`relative w-48 h-48 flex items-end justify-center transition-all duration-500 ${expr.container}`}>
      {/* Pot */}
      <div className="w-24 h-20 bg-amber-700 rounded-b-xl rounded-t-sm relative z-10 flex items-center justify-center shadow-lg">
        <div className="w-20 h-2 bg-amber-900/30 absolute top-2 rounded-full"></div>
        
        {/* Face on Pot */}
        <div className="flex flex-col items-center mb-2">
            <div className="flex gap-6">
                <div className={`${expr.eyes} transition-all duration-300`}></div>
                <div className={`${expr.eyes} transition-all duration-300`}></div>
            </div>
            <div className={`${expr.mouth} transition-all duration-300`}></div>
        </div>
      </div>

      {/* Pot Rim */}
      <div className="absolute bottom-[4.5rem] w-28 h-4 bg-amber-600 rounded-md shadow-md z-20"></div>

      {/* Plant Body (Stem) */}
      <div className="absolute bottom-20 w-4 h-24 bg-green-600 z-0 rounded-full origin-bottom transition-transform duration-1000"></div>

      {/* Leaves - dynamic colors based on health */}
      <div className={`absolute bottom-32 -left-8 w-16 h-8 bg-green-500 rounded-tl-full rounded-br-full transform -rotate-12 origin-right transition-all duration-500 
        ${mood === 'thirsty' || mood === 'hot' ? 'bg-yellow-600 rotate-45 translate-y-4' : 'animate-wave-left'}`}>
      </div>
      
      <div className={`absolute bottom-36 -right-8 w-16 h-8 bg-green-500 rounded-tr-full rounded-bl-full transform rotate-12 origin-left transition-all duration-500
        ${mood === 'thirsty' ? 'bg-yellow-600 -rotate-45 translate-y-4' : 'animate-wave-right'}`}>
      </div>

      <div className={`absolute bottom-44 w-12 h-12 bg-green-400 rounded-full opacity-80 blur-sm z-[-1]
        ${mood === 'happy' ? 'scale-110' : 'scale-0'} transition-transform`}></div>

      {/* Environment Effects (Sweat, Shiver lines, etc) */}
      {mood === 'hot' && (
        <div className="absolute top-0 right-10 text-blue-300 animate-bounce text-2xl">💦</div>
      )}
      {mood === 'freezing' && (
         <div className="absolute top-10 -right-4 text-white animate-pulse text-2xl">❄️</div>
      )}
       {mood === 'drowning' && (
         <div className="absolute bottom-0 w-full h-4 bg-blue-500/50 blur-md"></div>
      )}
    </div>
  );
};