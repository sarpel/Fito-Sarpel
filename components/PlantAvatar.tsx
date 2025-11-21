
import React from 'react';
import { PlantMood, PlantStage } from '../types';

interface PlantAvatarProps {
  mood: PlantMood;
  stage: PlantStage;
}

export const PlantAvatar: React.FC<PlantAvatarProps> = ({ mood, stage }) => {
  
  // Dynamic gradients for the pot based on mood
  const getPotStyle = () => {
    switch (mood) {
      case 'hot': return 'from-rose-600 to-rose-800 shadow-rose-900/50'; 
      case 'freezing': return 'from-blue-600 to-blue-800 shadow-blue-900/50'; 
      case 'drowning': return 'from-cyan-600 to-blue-700 shadow-blue-900/50'; 
      case 'thirsty': return 'from-amber-700 to-stone-800 shadow-stone-900/50'; 
      case 'scorched': return 'from-orange-500 to-orange-700 shadow-orange-900/50'; 
      case 'dark': return 'from-slate-700 to-slate-900 shadow-black/50';
      case 'sleeping': return 'from-indigo-800 to-indigo-950 shadow-indigo-900/50';
      default: return 'from-amber-600 to-amber-800 shadow-amber-900/50'; // Classic terracotta
    }
  };

  // Leaf colors
  const getLeafColor = () => {
    if (mood === 'thirsty') return '#d97706'; // withered yellow
    if (mood === 'freezing') return '#0e7490'; // frozen cyan
    if (mood === 'scorched') return '#10b981'; // bright emerald
    if (mood === 'dark') return '#14532d'; // dark green
    if (mood === 'sleeping') return '#1e40af'; // dark blue-green for night
    return '#22c55e'; // healthy green
  };

  // Helper to calculate stem height and width based on stage
  const getStemDimensions = () => {
    switch(stage) {
      case 1: return 'w-2 h-10 bottom-24';
      case 2: return 'w-2.5 h-16 bottom-24';
      case 3: return 'w-3 h-24 bottom-24';
      default: return 'w-3 h-28 bottom-24';
    }
  };

  return (
    <div className="relative w-64 h-64 flex items-end justify-center">
      
      {/* --- GROUND SHADOW --- */}
      <div className="absolute bottom-4 w-32 h-4 bg-black/40 rounded-[100%] blur-md transform scale-y-50 z-0"></div>

      {/* --- SLEEPING Zzz ANIMATION --- */}
      {mood === 'sleeping' && (
         <div className="absolute top-0 right-8 flex flex-col items-end animate-bounce-slow opacity-70 z-50">
            <span className="text-2xl font-bold text-white/80 font-mono">Z</span>
            <span className="text-xl font-bold text-white/60 font-mono mr-2 -mt-1">z</span>
            <span className="text-lg font-bold text-white/40 font-mono mr-4 -mt-1">z</span>
         </div>
      )}

      {/* --- PLANT STEM & LEAVES (Layered behind pot rim front, but atop pot back) --- */}
      <div className={`absolute z-10 flex flex-col items-center origin-bottom transition-all duration-1000 animate-breathe
         ${getStemDimensions()}
         ${mood === 'thirsty' ? 'rotate-6 scale-y-90 translate-y-4' : ''}
         ${mood === 'sleeping' ? 'scale-y-95 rotate-1' : ''}
      `}>
         {/* Main Stem */}
         <div className={`rounded-full relative transition-all duration-1000 w-full h-full
            ${mood === 'thirsty' ? 'bg-amber-700' : 'bg-gradient-to-t from-green-800 to-green-500'}
            ${mood === 'freezing' ? 'from-cyan-900 to-cyan-600' : ''}
            ${mood === 'sleeping' ? 'from-indigo-900 to-green-800' : ''}
         `}>
            
            {/* STAGE 3 & 4: Big Leaves (Lower Pair) */}
            {stage >= 3 && (
              <>
                {/* Left Leaf */}
                <div className={`absolute bottom-8 -left-12 origin-bottom-right transition-all duration-1000
                    ${mood === 'thirsty' ? 'rotate-[50deg] translate-y-6 opacity-80' : 'animate-wave-left'}
                    ${mood === 'freezing' ? 'animate-shiver' : ''}
                    ${mood === 'sleeping' ? 'rotate-[-5deg] scale-95' : ''}
                `}>
                  <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm filter">
                      <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" 
                            fill={getLeafColor()} 
                            className="transition-fill duration-700" />
                      <path d="M100,100 C50,50 30,30 0,0" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none"/>
                  </svg>
                </div>

                {/* Right Leaf */}
                <div className={`absolute bottom-12 -right-12 origin-bottom-left transition-all duration-1000
                    ${mood === 'thirsty' ? 'rotate-[-50deg] translate-y-6 opacity-80' : 'animate-wave-right'}
                    ${mood === 'freezing' ? 'animate-shiver' : ''}
                    ${mood === 'sleeping' ? 'rotate-[5deg] scale-95' : ''}
                `}>
                    <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm transform -scale-x-100">
                      <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" 
                            fill={getLeafColor()} 
                            className="transition-fill duration-700" />
                      <path d="M100,100 C50,50 30,30 0,0" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none"/>
                  </svg>
                </div>
              </>
            )}

            {/* STAGE 3 & 4: Extra Foliage (Upper Pair - Smaller) */}
            {stage >= 3 && (
              <>
                <div className={`absolute top-1/3 -left-8 origin-bottom-right transition-all duration-1000 scale-75
                    ${mood === 'thirsty' ? 'rotate-[60deg] translate-y-4 opacity-80' : 'animate-wave-left'}
                    ${mood === 'freezing' ? 'animate-shiver' : ''}
                `}>
                  <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm">
                      <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" fill={getLeafColor()} />
                  </svg>
                </div>
                
                <div className={`absolute top-1/4 -right-8 origin-bottom-left transition-all duration-1000 scale-75
                    ${mood === 'thirsty' ? 'rotate-[-60deg] translate-y-4 opacity-80' : 'animate-wave-right'}
                    ${mood === 'freezing' ? 'animate-shiver' : ''}
                `}>
                    <svg width="60" height="60" viewBox="0 0 100 100" className="drop-shadow-sm transform -scale-x-100">
                      <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" fill={getLeafColor()} />
                    </svg>
                </div>
              </>
            )}

            {/* STAGE 2: Sprout Leaves (Medium size) */}
            {stage === 2 && (
               <>
                 <div className={`absolute bottom-6 -left-6 origin-bottom-right scale-50 ${mood === 'sleeping' ? '' : 'animate-wave-left'}`}>
                    <svg width="60" height="60" viewBox="0 0 100 100">
                      <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" fill={getLeafColor()} />
                    </svg>
                 </div>
                 <div className={`absolute bottom-8 -right-6 origin-bottom-left scale-50 transform -scale-x-100 ${mood === 'sleeping' ? '' : 'animate-wave-right'}`}>
                    <svg width="60" height="60" viewBox="0 0 100 100">
                      <path d="M100,100 C20,80 0,20 0,0 C40,10 90,50 100,100" fill={getLeafColor()} />
                    </svg>
                 </div>
               </>
            )}

            {/* STAGE 1: Tiny Seedling Leaves */}
            {stage === 1 && (
               <>
                  <div className="absolute top-0 -left-3 w-4 h-4 bg-green-500 rounded-full rounded-br-none -rotate-45"></div>
                  <div className="absolute top-0 right-1 w-4 h-4 bg-green-500 rounded-full rounded-bl-none rotate-45"></div>
               </>
            )}

             {/* Top Sprout / Flower (Always on top of stem) */}
             <div className={`absolute -top-4 left-1/2 -translate-x-1/2 origin-bottom transition-all duration-1000
                 ${mood === 'thirsty' ? 'rotate-90 scale-0' : 'scale-100'}
                 ${mood === 'sleeping' ? 'rotate-12 scale-90' : ''}
             `}>
                {/* Stage 4: FLOWER */}
                {stage === 4 ? (
                  <div className={`w-20 h-20 -mt-10 relative ${mood === 'sleeping' ? 'opacity-80 scale-90' : 'animate-pulse'}`}>
                     <svg viewBox="0 0 100 100" className="drop-shadow-md">
                       {/* Petals */}
                       <g transform="translate(50,50)">
                          {[0, 45, 90, 135, 180, 225, 270, 315].map(rot => (
                             <ellipse key={rot} cx="0" cy="-25" rx="10" ry="25" 
                                fill={mood === 'sleeping' ? '#db2777' : '#f472b6'} 
                                transform={`rotate(${rot})`} />
                          ))}
                          <circle cx="0" cy="0" r="15" fill="#fbbf24" />
                       </g>
                     </svg>
                  </div>
                ) : (
                  /* Standard Sprout Tip for stages 2 and 3 */
                  stage > 1 && (
                    <div className="w-6 h-6">
                      <svg width="30" height="30" viewBox="0 0 100 100">
                          <path d="M50,100 C20,60 20,20 50,0 C80,20 80,60 50,100" 
                                fill={mood === 'freezing' ? '#67e8f9' : '#86efac'} />
                      </svg>
                    </div>
                  )
                )}
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
            transition-all duration-700 border-x border-b border-white/5
         `}>
             {/* Highlight/Reflection for 3D effect */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 via-transparent to-transparent pointer-events-none rounded-b-[3rem] z-20"></div>
             <div className="absolute top-2 right-4 w-2 h-12 bg-white/10 rounded-full rotate-12 blur-[1px] z-20"></div>

            {/* --- REACTIVE MOOD OVERLAYS --- */}
            
            {/* Freezing: Frost Texture & Icy Rim */}
            {mood === 'freezing' && (
               <>
                   <div className="absolute inset-0 z-10 opacity-60 pointer-events-none rounded-b-[3rem]"
                        style={{
                           backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 2px, transparent 2px, transparent 8px), radial-gradient(circle at 30% 30%, rgba(255,255,255,0.4), transparent 40%)'
                        }}
                   ></div>
                   <div className="absolute top-0 w-full h-4 bg-white/40 blur-sm"></div>
               </>
            )}

            {/* Hot: Heat Shimmer & Red Pulse */}
            {mood === 'hot' && (
               <>
                  <div className="absolute -inset-full top-0 block h-full w-[200%] -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-30 animate-heat-shimmer z-10 pointer-events-none"></div>
                  <div className="absolute inset-0 bg-red-500/10 animate-pulse z-0"></div>
               </>
            )}

            {/* Drowning: Wet Gloss / Condensation Animations */}
            {mood === 'drowning' && (
               <div className="absolute inset-0 z-10 pointer-events-none rounded-b-[3rem] bg-gradient-to-b from-blue-400/10 to-blue-600/30">
                  <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.3)_0%,transparent_60%,rgba(0,0,255,0.1)_100%)]"></div>
                  {/* Droplets */}
                  <div className="absolute top-2 left-10 w-1.5 h-1.5 bg-blue-100 rounded-full animate-drip shadow-sm" style={{animationDuration: '1.5s'}}></div>
                  <div className="absolute top-4 left-20 w-2 h-2 bg-blue-100 rounded-full animate-drip shadow-sm" style={{animationDuration: '2.2s', animationDelay: '0.5s'}}></div>
                  <div className="absolute top-2 right-8 w-1.5 h-3 bg-blue-100 rounded-full animate-drip shadow-sm" style={{animationDuration: '1.8s', animationDelay: '1s'}}></div>
               </div>
            )}
            
             {/* Thirsty / Scorched: Cracked / Dry Texture */}
            {(mood === 'scorched' || mood === 'thirsty') && (
                <div className="absolute inset-0 z-10 pointer-events-none rounded-b-[3rem] opacity-25 mix-blend-overlay"
                    style={{
                        backgroundImage: `linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.4) 50%, transparent 52%),
                                          linear-gradient(-45deg, transparent 48%, rgba(0,0,0,0.4) 50%, transparent 52%)`,
                        backgroundSize: '20px 20px'
                    }}
                ></div>
            )}


            {/* --- FACE CONTAINER --- */}
            <div className="relative z-40 w-full flex flex-col items-center justify-center -mt-2">
                
                {/* SWEAT DROPS (Forehead) */}
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
                          ${mood === 'sleeping' ? 'w-4 h-0.5 bg-stone-900' : ''} /* Closed eye line */
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
                          ${mood === 'sleeping' ? 'w-4 h-0.5 bg-stone-900' : ''} /* Closed eye line */
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

                  {/* Sleeping Circle Mouth */}
                  {mood === 'sleeping' && (
                      <div className="w-2 h-2 bg-stone-900 rounded-full mt-1 opacity-60"></div>
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
