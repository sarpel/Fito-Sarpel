import React from 'react';
import { PlantMood } from '../types';
import { MOOD_GIFS } from '../constants';

interface MoodGifProps {
  mood: PlantMood;
}

export const MoodGif: React.FC<MoodGifProps> = ({ mood }) => {
  // We render all GIFs but toggle opacity to create a cross-fade effect.
  // This also ensures images are preloaded.
  
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl bg-gray-900">
      {/* Iterate over all possible moods to allow smooth cross-fading */}
      {(Object.keys(MOOD_GIFS) as PlantMood[]).map((moodKey) => {
        const isActive = moodKey === mood;
        
        return (
          <img
            key={moodKey}
            src={MOOD_GIFS[moodKey]}
            alt=""
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out
              ${isActive ? 'opacity-80 scale-105 blur-0 grayscale-0' : 'opacity-0 scale-100 blur-md grayscale'}
            `}
            aria-hidden="true"
          />
        );
      })}
      
      {/* Gradient Overlay - Lighter in the center to show off the meme, darker at edges for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900/90 via-transparent to-gray-900/90" />
    </div>
  );
};
