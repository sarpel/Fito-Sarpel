import React from 'react';
import { PlantMood } from '../types';

interface PlantAvatarProps {
  mood: PlantMood;
}

export const PlantAvatar: React.FC<PlantAvatarProps> = ({ mood }) => {
  
  // Dynamic gradients for the pot based on mood
  const getPotStyle = () => {
    switch (mood) {
      case 'hot': return 'from-rose-600 to-rose-800 shadow-rose-900/50'; 
      case 'freezing': return 'from-blue-600 to-blue-800 shadow-blue-900/50'; 
      case 'drowning': return 'from-cyan-600 to-blue-700 shadow-blue-900/50'; 
      case 'thirsty': return 'from-amber-700 to-stone-800 shadow-stone-900/50'; 
      case 'scorched': return 'from-orange-500 to-orange-700 shadow-orange-900/50'; 
      case 'dark': return 'from-slate-700 to-slate-900 shadow-black/50';
      default: return 'from-amber-600 to-amber-800 shadow-amber-900/50'; // Classic terracotta
    }
  };

  // Leaf colors
  const getLeafColor = () => {
    if (mood === 'thirsty') return '#d97706'; // withered yellow
    if (mood === 'freezing') return '#0e7490'; // frozen cyan
    if (mood === 'scorched') return '#10b981'; // bright emerald
    if (mood === 'dark') return '#14532d'; // dark green
    return '#22c55e'; // healthy green
  };

  return (
    <div className="relative w-64 h-64 flex items-end justify-center">
      
      {/* --- GROUND SHADOW --- */}
      <div className="absolute bottom-4 w-32 h-4 bg-black/40 rounded-[100%] blur-md transform scale-y-50 z-0"></div>

      {/* --- PLANT STEM & LEAVES (Layered behind pot rim front, but atop pot back) --- */}
      <div className={`absolute bottom-24 z-10 flex flex-col items-center origin-bottom transition-all duration-1000
         ${mood === 'thirsty' ? 'rotate-6 scale-y-90 translate-y-4' : ''}
      `}>
         {/* Main Stem */}
         <div className={`w-3 h-28 rounded-full relative transition-colors duration-1000
            ${mood === 'thirsty' ? 'bg-amber-700' : 'bg-gradient-to-t from-green-800 to-green-500'}
            ${mood === 'freezing' ? 'from-cyan-900 to-cyan-600' : ''}
         `}>
            
            {/* Left Leaf */}
            <div className={`absolute bottom-10 -left-12 origin-bottom-right transition-all duration-1000
                ${mood === 'thirsty' ? 'rotate-[50deg] translate-y-6 opacity-80' : 'animate-wave-left'}
                ${mood === 'freezing' ? 'animate-shiver' : ''}
            `}>
               <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm filter">
                  <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" 
                        fill={getLeafColor()} 
                        className="transition-fill duration-700" />
                  <path d="M100,100 C50,50 30,30 0,0" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none"/>
               </svg>
            </div>

            {/* Right Leaf */}
            <div className={`absolute bottom-14 -right-12 origin-bottom-left transition-all duration-1000
                ${mood === 'thirsty' ? 'rotate-[-50deg] translate-y-6 opacity-80' : 'animate-wave-right'}
                ${mood === 'freezing' ? 'animate-shiver' : ''}
            `}>
                <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm transform -scale-x-100">
                  <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" 
                        fill={getLeafColor()} 
                        className="transition-fill duration-700" />
                  <path d="M100,100 C50,50 30,30 0,0" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none"/>
               </svg>
            </div>

             {/* Top Sprout / New Leaf */}
             <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 origin-bottom transition-all duration-1000
                 ${mood === 'thirsty' ? 'rotate-90 scale-0' : 'scale-100'}
             `}>
                 <svg width="30" height="30" viewBox="0 0 100 100">
                    <path d="M50,100 C20,60 20,20 50,0 C80,20 80,60 50,100" 
                          fill={mood === 'freezing' ? '#67e8f9' : '#86efac'} />
                 </svg>
             </div>
         </div>
      </div>

      {/* --- THE POT --- */}
      <div className={`relative z-20 flex flex-col items-center transition-transform duration-300
         ${mood === 'freezing' ? 'animate-shiver' : ''} 
         ${mood === 'hot' ? 'animate-shake' : ''}
      `}>
         
         {/* Pot Rim (The opening) */}
         <div className={`w-40 h-8 rounded-full bg-gradient-to-r ${getPotStyle().split(' ')[0]} ${getPotStyle().split(' ')[1]} 
            relative z-30 shadow-lg flex items-center justify-center border-b border-black/20
         `}>
            {/* Soil Layer */}
            <div className="w-[90%] h-[70%] bg-stone-800 rounded-full shadow-inner opacity-90"></div>
         </div>

         {/* Pot Body */}
         <div className={`w-36 h-28 -mt-4 bg-gradient-to-br ${getPotStyle()} 
            rounded-b-[3rem] rounded-t-lg shadow-2xl flex flex-col items-center justify-center relative overflow-hidden
            transition-all duration-700
         `}>
             {/* Highlght/Reflection for 3D effect */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-b-[3rem]"></div>
             <div className="absolute top-2 right-4 w-2 h-12 bg-white/10 rounded-full rotate-12 blur-[1px]"></div>

            {/* --- FACE CONTAINER --- */}
            <div className="relative z-40 w-full flex flex-col items-center justify-center -mt-2">
                
                {/* SWEAT DROPS */}
                {(mood === 'hot' || mood === 'drowning') && (
                    <>
                      <div className="absolute -top-8 right-6 w-2 h-3 bg-blue-300 rounded-full animate-drip opacity-80"></div>
                      <div className="absolute -top-6 left-6 w-2 h-2 bg-blue-300 rounded-full animate-drip opacity-80" style={{animationDelay: '0.7s'}}></div>
                    </>
                )}

                {/* EYES */}
                <div className="flex gap-5 mb-3 items-center justify-center h-8">
                    {/* Sunglasses for 'scorched' */}
                    {mood === 'scorched' ? (
                      <div className="relative flex items-center animate-bounce-slow" style={{animationDuration: '3s'}}>
                        <div className="w-10 h-6 bg-black rounded-sm border-2 border-gray-800 relative overflow-hidden shadow-sm">
                           <div className="absolute top-[-2px] right-0 w-8 h-12 bg-white/20 rotate-[-25deg]"></div>
                        </div> 
                        <div className="w-3 h-1 bg-black"></div> 
                        <div className="w-10 h-6 bg-black rounded-sm border-2 border-gray-800 relative overflow-hidden shadow-sm">
                            <div className="absolute top-[-2px] right-0 w-8 h-12 bg-white/20 rotate-[-25deg]"></div>
                        </div> 
                      </div>
                    ) : (
                      <>
                        {/* Left Eye */}
                        <div className={`
                          bg-stone-900 rounded-full transition-all duration-500 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.2)]
                          ${mood === 'happy' ? 'w-3 h-3' : ''}
                          ${mood === 'thirsty' ? 'w-3 h-3 opacity-70 scale-y-75' : ''}
                          ${mood === 'drowning' ? 'w-4 h-4 bg-blue-950 ring-2 ring-blue-300/30' : ''}
                          ${mood === 'hot' ? 'w-4 h-1 translate-y-1 rotate-12 rounded-none' : ''} /* > shape */
                          ${mood === 'freezing' ? 'w-3 h-3 bg-blue-100' : ''}
                          ${mood === 'dark' ? 'w-8 h-1 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : ''}
                        `}></div>
                        
                        {/* Right Eye */}
                        <div className={`
                          bg-stone-900 rounded-full transition-all duration-500 shadow-[inset_0_-1px_2px_rgba(255,255,255,0.2)]
                          ${mood === 'happy' ? 'w-3 h-3' : ''}
                          ${mood === 'thirsty' ? 'w-3 h-3 opacity-70 scale-y-75' : ''}
                          ${mood === 'drowning' ? 'w-4 h-4 bg-blue-950 ring-2 ring-blue-300/30' : ''}
                          ${mood === 'hot' ? 'w-4 h-1 translate-y-1 -rotate-12 rounded-none' : ''} /* < shape */
                          ${mood === 'freezing' ? 'w-3 h-3 bg-blue-100' : ''}
                          ${mood === 'dark' ? 'w-8 h-1 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.6)]' : ''}
                        `}></div>
                      </>
                    )}
                </div>

                {/* MOUTH */}
                <div className="relative flex justify-center h-6">
                  
                  {/* Happy / Scorched Smile */}
                  {(mood === 'happy' || mood === 'scorched') && (
                      <div className="w-6 h-3 border-b-4 border-stone-900 rounded-full opacity-80"></div>
                  )}

                  {/* Thirsty Frown */}
                  {mood === 'thirsty' && (
                       <div className="w-6 h-3 border-t-4 border-stone-800 rounded-full mt-2 opacity-80"></div>
                  )}

                  {/* Drowning Open Mouth */}
                  {mood === 'drowning' && (
                       <div className="w-3 h-4 bg-stone-900 rounded-full mt-1 animate-pulse"></div>
                  )}

                  {/* Hot Panting */}
                  {mood === 'hot' && (
                    <div className="relative">
                        <div className="w-6 h-3 bg-stone-900 rounded-b-full"></div>
                        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-4 bg-rose-500 rounded-b-full animate-pant border border-rose-700 shadow-sm"></div>
                    </div>
                  )}

                  {/* Freezing Teeth Chatter (Line) */}
                  {mood === 'freezing' && (
                    <div className="w-6 h-1 bg-stone-800 rounded-full mt-2 relative">
                         {/* Thermometer */}
                         <div className="absolute -top-1 -right-8 w-14 h-3 bg-white/90 rounded-full -rotate-12 border border-gray-200 shadow-sm flex items-center px-1">
                             <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                             <div className="h-1 w-full bg-red-200 ml-0.5 rounded-r-sm"></div>
                         </div>
                    </div>
                  )}
                  
                  {/* Dark Straight Line */}
                  {mood === 'dark' && (
                      <div className="w-4 h-1 bg-stone-300/50 rounded-full mt-2"></div>
                  )}

                </div>
            </div>
         </div>
      </div>

      {/* Happy Aura (Background Glow) */}
      <div className={`absolute bottom-28 w-40 h-40 bg-green-400 rounded-full mix-blend-screen filter blur-3xl z-[-1] transition-all duration-1000
        ${mood === 'happy' ? 'opacity-40 scale-100' : 'opacity-0 scale-50'}`}></div>

    </div>
  );
};
