import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlantAvatar } from './components/PlantAvatar';
import { SensorCard } from './components/SensorCard';
import { MoodGif } from './components/MoodGif';
import { generatePlantThought } from './services/geminiService';
import { SensorData, PlantMood, PlantStage } from './types';
import { PLANT_THRESHOLDS, DEFAULT_SENSOR_DATA, CARE_TIPS, GROWTH_CONFIG } from './constants';
import { Settings, Thermometer, Droplets, Sun, Cpu, Sprout, Edit2, Check, X, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  // State for sensor readings
  const [sensorData, setSensorData] = useState<SensorData>(DEFAULT_SENSOR_DATA);
  
  // State for determined mood, nickname, and AI thought
  const [mood, setMood] = useState<PlantMood>('happy');
  const [nickname, setNickname] = useState<string>("Sprout");
  const [tempNickname, setTempNickname] = useState<string>("Sprout");
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [aiThought, setAiThought] = useState<string>("I'm just photosynthesizing...");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  // Growth State
  const [xp, setXp] = useState<number>(0);
  const [stage, setStage] = useState<PlantStage>(1);

  // UI States
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showCareTips, setShowCareTips] = useState<boolean>(false);

  // Ref to debounce AI calls
  const lastAiUpdateRef = useRef<number>(0);
  
  // Logic to determine mood based on thresholds
  const determineMood = useCallback((data: SensorData): PlantMood => {
    const { moisture, temperature, light } = data;
    const t = PLANT_THRESHOLDS;

    if (moisture < t.moisture.low) return 'thirsty';
    if (moisture > t.moisture.high) return 'drowning';
    
    if (temperature < t.temperature.low) return 'freezing';
    if (temperature > t.temperature.high) return 'hot';
    
    if (light < t.light.low) return 'dark';
    if (light > t.light.high) return 'scorched';

    return 'happy';
  }, []);

  // Update mood when sensor data changes
  useEffect(() => {
    const newMood = determineMood(sensorData);
    setMood(newMood);
  }, [sensorData, determineMood]);

  // Growth Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mood === 'happy') {
      interval = setInterval(() => {
        setXp((prevXp) => {
          const newXp = prevXp + GROWTH_CONFIG.XP_PER_TICK;
          
          // Determine Stage based on XP
          if (newXp >= GROWTH_CONFIG.THRESHOLDS[4]) setStage(4);
          else if (newXp >= GROWTH_CONFIG.THRESHOLDS[3]) setStage(3);
          else if (newXp >= GROWTH_CONFIG.THRESHOLDS[2]) setStage(2);
          
          return newXp;
        });
      }, GROWTH_CONFIG.TICK_RATE_MS);
    }
    return () => clearInterval(interval);
  }, [mood]);

  // AI Thought Generator Effect
  useEffect(() => {
    const now = Date.now();
    // Only fetch new thought if mood changed OR it's been at least 30 seconds to avoid spamming API
    const timeSinceLastUpdate = now - lastAiUpdateRef.current;
    
    if (timeSinceLastUpdate > 30000 || lastAiUpdateRef.current === 0) {
      fetchAiThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, stage]); // Also trigger when stage changes

  const fetchAiThought = async () => {
    // If no API key and not in sim mode, might want to skip, but we have fallbacks now
    setIsThinking(true);
    try {
      const thought = await generatePlantThought(sensorData, mood, nickname);
      setAiThought(thought);
      lastAiUpdateRef.current = Date.now();
    } catch (error) {
      console.error("Failed to get plant thoughts:", error);
      setAiThought("...");
    } finally {
      setIsThinking(false);
    }
  };

  // Manual slider change handler
  const handleSensorChange = (key: keyof SensorData, value: number) => {
    setSensorData(prev => ({ ...prev, [key]: value }));
  };

  // Handle nickname edit start
  const startEditing = () => {
    setTempNickname(nickname);
    setIsEditingName(true);
  };

  // Handle nickname save
  const saveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      setIsEditingName(false);
      // Trigger a new thought with the new name shortly after
      setTimeout(() => fetchAiThought(), 500);
    }
  };

  // Calculate progress to next level
  const getNextLevelXp = () => {
    if (stage === 4) return GROWTH_CONFIG.THRESHOLDS[4]; // Cap at max
    return GROWTH_CONFIG.THRESHOLDS[(stage + 1) as PlantStage];
  };

  const getPrevLevelXp = () => {
    if (stage === 1) return 0;
    return GROWTH_CONFIG.THRESHOLDS[stage as PlantStage];
  };

  const progressPercent = Math.min(100, Math.max(0, 
    ((xp - getPrevLevelXp()) / (getNextLevelXp() - getPrevLevelXp())) * 100
  ));

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Ambient Glow based on Mood */}
      <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 pointer-events-none 
        ${mood === 'happy' ? 'bg-green-500' : ''}
        ${mood === 'thirsty' ? 'bg-yellow-600' : ''}
        ${mood === 'drowning' ? 'bg-blue-700' : ''}
        ${mood === 'hot' || mood === 'scorched' ? 'bg-red-600' : ''}
        ${mood === 'freezing' ? 'bg-cyan-300' : ''}
        ${mood === 'dark' ? 'bg-gray-900' : ''}
      `} />

      {/* Flickering Dark Mode Overlay */}
      {mood === 'dark' && (
         <div className="absolute inset-0 bg-black/40 animate-flicker pointer-events-none z-20 mix-blend-multiply"></div>
      )}

      {/* Main LCD Display Container */}
      <div className="z-10 w-full max-w-md bg-black/60 backdrop-blur-xl border-4 border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative min-h-[600px]">
        
        {/* Animated GIF Background Layer */}
        <MoodGif mood={mood} />

        {/* Header / Status Bar */}
        <div className="relative z-10 flex justify-between items-center p-4 border-b border-gray-800/50 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Cpu size={14} />
            <span>RPi-Z-2W</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <div className="flex items-center gap-3">
             <button 
              onClick={() => setShowCareTips(!showCareTips)}
              className={`transition-colors ${showCareTips ? 'text-green-400' : 'text-gray-400 hover:text-green-200'}`}
              title="Care Tips"
            >
              <Sprout size={18} />
            </button>
            <button 
              onClick={() => setShowControls(!showControls)}
              className={`transition-colors ${showControls ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
              title="Settings / Simulation"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
          
          {/* Nickname Editor */}
          <div className="mb-2 flex items-center gap-2 z-50 flex-col">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center bg-black/50 rounded-lg p-1 border border-gray-600">
                  <input 
                    type="text" 
                    value={tempNickname}
                    onChange={(e) => setTempNickname(e.target.value)}
                    className="bg-transparent border-none text-white text-center font-bold w-32 focus:ring-0 outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && saveNickname()}
                  />
                  <button onClick={saveNickname} className="text-green-400 hover:text-green-300 p-1"><Check size={16} /></button>
                  <button onClick={() => setIsEditingName(false)} className="text-red-400 hover:text-red-300 p-1"><X size={16} /></button>
                </div>
              ) : (
                <div className="group flex items-center gap-2 cursor-pointer" onClick={startEditing}>
                  <h2 className="text-2xl font-bold text-white drop-shadow-md group-hover:text-green-200 transition-colors">
                    {nickname}
                  </h2>
                  <Edit2 size={14} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
            
            {/* Growth Progress Bar */}
            <div className="w-32 flex flex-col gap-1 items-center" title={`XP: ${xp}`}>
              <div className="flex justify-between w-full text-[10px] text-gray-300 uppercase font-bold tracking-wider">
                 <span>Lvl {stage}</span>
                 <span>{GROWTH_CONFIG.STAGE_NAMES[stage]}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
                 <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-1000"
                    style={{ width: `${stage === 4 ? 100 : progressPercent}%` }}
                 ></div>
              </div>
            </div>
          </div>

          {/* Plant Avatar Visualization */}
          <div className="mb-6 transform scale-110">
            <PlantAvatar mood={mood} stage={stage} />
          </div>

          {/* AI Speech Bubble */}
          <div className="bg-white/90 text-gray-900 p-4 rounded-2xl rounded-tr-none shadow-lg max-w-[80%] animate-bounce-slow relative min-h-[80px] flex items-center justify-center">
            <div className="absolute -top-2 right-0 w-4 h-4 bg-white/90 transform rotate-45 translate-y-2"></div>
            <p className="font-mono-display text-lg leading-tight text-center">
              {isThinking ? (
                <span className="animate-pulse">Thinking...</span>
              ) : (
                aiThought
              )}
            </p>
          </div>
        </div>

        {/* Sensor Readings Grid */}
        <div className="relative z-10 grid grid-cols-3 gap-2 p-4 bg-gray-900/60 backdrop-blur-md border-t border-gray-800">
          <SensorCard 
            icon={<Droplets size={20} />}
            label="Moisture"
            value={sensorData.moisture}
            unit="%"
            status={sensorData.moisture < 30 || sensorData.moisture > 85 ? 'danger' : 'good'}
          />
          <SensorCard 
            icon={<Thermometer size={20} />}
            label="Temp"
            value={sensorData.temperature}
            unit="°C"
            status={sensorData.temperature < 15 || sensorData.temperature > 30 ? 'danger' : 'good'}
          />
          <SensorCard 
            icon={<Sun size={20} />}
            label="Light"
            value={sensorData.light}
            unit="lx"
            status={sensorData.light < 100 || sensorData.light > 800 ? 'warning' : 'good'}
          />
        </div>

        {/* Collapsible Care Tips Section */}
        {showCareTips && (
          <div className="relative z-20 bg-green-900/90 p-4 border-t border-green-700 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-bold text-green-100 flex items-center gap-2 mb-2">
              <Sprout size={16} /> Care Guide: {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </h3>
            <p className="text-sm text-green-50 leading-relaxed">
              {CARE_TIPS[mood]}
            </p>
          </div>
        )}

        {/* Collapsible Simulation Controls */}
        {showControls && (
          <div className="relative z-20 bg-gray-800/95 p-4 border-t border-gray-700 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-300 flex items-center gap-2">
                <Settings size={16} /> Sensor Simulation
              </h3>
              <div className="flex gap-2">
                {/* Manual Grow Button for Demo */}
                <button 
                   onClick={() => { setXp(prev => prev + 20); }}
                   className="px-2 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs font-bold text-white flex items-center gap-1"
                >
                  <Sparkles size={12}/> Grow
                </button>

                <label className="flex items-center gap-2 text-xs cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isSimulationMode}
                    onChange={(e) => setIsSimulationMode(e.target.checked)}
                    className="rounded bg-gray-700 border-gray-600 text-green-500 focus:ring-green-500"
                  />
                  Simulate
                </label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Moisture</span>
                  <span>{sensorData.moisture}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={sensorData.moisture}
                  onChange={(e) => handleSensorChange('moisture', parseInt(e.target.value))}
                  disabled={!isSimulationMode}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Temperature</span>
                  <span>{sensorData.temperature}°C</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={sensorData.temperature}
                  onChange={(e) => handleSensorChange('temperature', parseInt(e.target.value))}
                  disabled={!isSimulationMode}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500 disabled:opacity-50"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1 text-gray-400">
                  <span>Light</span>
                  <span>{sensorData.light} lx</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1000" 
                  value={sensorData.light}
                  onChange={(e) => handleSensorChange('light', parseInt(e.target.value))}
                  disabled={!isSimulationMode}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-500 disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;