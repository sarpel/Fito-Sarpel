
import React, { useState } from 'react';
import { PlantMood } from '../types';
import { MOOD_GIFS } from '../constants';

interface MoodGifProps {
  mood: PlantMood;
}

export const MoodGif: React.FC<MoodGifProps> = ({ mood }) => {
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleError = (moodKey: string) => {
    setFailedImages(prev => {
      const newSet = new Set(prev);
      newSet.add(moodKey);
      return newSet;
    });
  };

  // Helper to get a backup gradient if image fails
  const getBackupGradient = (m: string) => {
    switch (m) {
      case 'happy': return 'bg-gradient-to-br from-green-900 to-emerald-900';
      case 'thirsty': return 'bg-gradient-to-br from-yellow-900 to-stone-900';
      case 'drowning': return 'bg-gradient-to-br from-blue-900 to-cyan-900';
      case 'hot': return 'bg-gradient-to-br from-red-900 to-orange-900';
      case 'freezing': return 'bg-gradient-to-br from-cyan-900 to-blue-950';
      case 'dark': return 'bg-gradient-to-br from-gray-900 to-black';
      case 'scorched': return 'bg-gradient-to-br from-orange-900 to-red-950';
      default: return 'bg-gray-900';
    }
  };

  return (
    <div className={`absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl transition-colors duration-1000 ${getBackupGradient(mood)}`}>
      {/* Iterate over all possible moods to allow smooth cross-fading */}
      {(Object.keys(MOOD_GIFS) as PlantMood[]).map((moodKey) => {
        const isActive = moodKey === mood;
        const isFailed = failedImages.has(moodKey);
        
        if (isFailed) return null;

        return (
          <img
            key={moodKey}
            src={MOOD_GIFS[moodKey]}
            onError={() => handleError(moodKey)}
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
