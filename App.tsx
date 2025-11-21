
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlantAvatar } from './components/PlantAvatar';
import { SensorCard } from './components/SensorCard';
import { MoodGif } from './components/MoodGif';
import { generatePlantThought } from './services/geminiService';
import { SensorData, PlantMood, PlantStage, WateringSchedule, SensorThresholds, WateringFrequency } from './types';
import { DEFAULT_SENSOR_DATA, CARE_TIPS, GROWTH_CONFIG } from './constants';
import { config } from './plantConfig';
import { PLANT_DATABASE } from './data/plantDatabase';
import { Settings, Thermometer, Droplets, Sun, Cpu, Sprout, Edit2, Check, X, Sparkles, Calendar, Bell, Clock, AlertTriangle, Leaf } from 'lucide-react';

const App: React.FC = () => {
  // State for sensor readings
  const [sensorData, setSensorData] = useState<SensorData>(DEFAULT_SENSOR_DATA);
  
  // State for Plant Configuration (Thresholds & Species)
  const [currentSpeciesId, setCurrentSpeciesId] = useState<string>("custom");
  const [thresholds, setThresholds] = useState<SensorThresholds>(config.thresholds);
  
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

  // Schedule State
  const [schedule, setSchedule] = useState<WateringSchedule>({ 
    day: 'Monday', 
    time: '09:00', 
    frequencyDays: 7, 
    enabled: false 
  });
  const [isWateringDue, setIsWateringDue] = useState<boolean>(false);

  // System Time State
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // UI States
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);
  const [showCareTips, setShowCareTips] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  // Ref to debounce AI calls
  const lastAiUpdateRef = useRef<number>(0);

  const isDaytime = () => {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 20; // 7 AM to 8 PM is considered "Day"
  };
  
  // Logic to determine mood based on DYNAMIC thresholds and schedule
  const determineMood = useCallback((data: SensorData): PlantMood => {
    const { moisture, temperature, light } = data;
    const t = thresholds; // Use current dynamic thresholds

    // Critical survival thresholds take precedence over schedule
    if (moisture > t.moisture.high) return 'drowning';
    if (temperature < t.temperature.low) return 'freezing';
    if (temperature > t.temperature.high) return 'hot';
    if (light > t.light.high) return 'scorched';

    // Schedule Override: If watering is due, force thirsty unless we are drowning
    if (isWateringDue) return 'thirsty';

    // Normal thresholds
    if (moisture < t.moisture.low) return 'thirsty';
    
    // Light logic with Day/Night cycle
    if (light < t.light.low) {
      // If it's dark, check if it SHOULD be dark (Night time)
      if (!isDaytime()) {
        return 'sleeping'; // Normal for night
      }
      return 'dark'; // Scary for day
    }

    return 'happy';
  }, [isWateringDue, thresholds]);

  // Update mood when sensor data or thresholds change OR time changes
  useEffect(() => {
    const newMood = determineMood(sensorData);
    setMood(newMood);
  }, [sensorData, determineMood, currentTime]);

  // Handle Species Selection
  const handleSpeciesChange = (speciesId: string) => {
    const selected = PLANT_DATABASE.find(p => p.id === speciesId);
    if (selected) {
      setCurrentSpeciesId(selected.id);
      setThresholds(selected.thresholds);
      // Also update nickname if it was still the default
      if (nickname === "Sprout" && selected.id !== 'custom') {
        setNickname(selected.name.split(' ')[0]);
        setTempNickname(selected.name.split(' ')[0]);
      }
    }
  };

  // Clock Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Schedule Checker Logic
  useEffect(() => {
    if (!schedule.enabled) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[now.getDay()];
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Simple trigger check (Ideally this would use a real timestamp difference calculation)
      // Triggers if it matches the 'Day' anchor AND time.
      // Note: For a robust system supporting "Every 3 days", we'd store "LastWateredDate"
      if (currentDay === schedule.day && currentTimeStr === schedule.time && !isWateringDue) {
        setIsWateringDue(true);
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(checkInterval);
  }, [schedule, isWateringDue]);

  // Auto-Dismiss Schedule Alert if Plant is Watered
  useEffect(() => {
    // If watering was due, but moisture is now significantly higher than low threshold
    if (isWateringDue && sensorData.moisture > thresholds.moisture.low + 10) {
      setIsWateringDue(false);
    }
  }, [sensorData.moisture, isWateringDue, thresholds]);

  // Growth Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mood === 'happy') {
      interval = setInterval(() => {
        setXp((prevXp) => {
          const newXp = prevXp + GROWTH_CONFIG.XP_PER_TICK;
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
    const timeSinceLastUpdate = now - lastAiUpdateRef.current;
    
    if (timeSinceLastUpdate > 30000 || lastAiUpdateRef.current === 0) {
      fetchAiThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood, stage]);

  const fetchAiThought = async () => {
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

  // Nickname handlers
  const startEditing = () => {
    setTempNickname(nickname);
    setIsEditingName(true);
  };

  const saveNickname = () => {
    if (tempNickname.trim()) {
      setNickname(tempNickname);
      setIsEditingName(false);
      setTimeout(() => fetchAiThought(), 500);
    }
  };

  const getNextLevelXp = () => stage === 4 ? GROWTH_CONFIG.THRESHOLDS[4] : GROWTH_CONFIG.THRESHOLDS[(stage + 1) as PlantStage];
  const getPrevLevelXp = () => stage === 1 ? 0 : GROWTH_CONFIG.THRESHOLDS[stage as PlantStage];
  const progressPercent = Math.min(100, Math.max(0, ((xp - getPrevLevelXp()) / (getNextLevelXp() - getPrevLevelXp())) * 100));

  // Smart Warning Logic
  const getScheduleWarning = (): string | null => {
    if (!schedule.enabled) return null;
    
    const species = PLANT_DATABASE.find(p => p.id === currentSpeciesId);
    if (!species) return null;

    // If user waters MORE frequently (smaller number) than recommended
    // e.g., User (every 1 day) < Species (every 14 days)
    if (schedule.frequencyDays < species.idealWateringFrequencyDays / 2) {
       return `⚠️ Warning: This ${species.name} prefers watering every ${species.idealWateringFrequencyDays} days. Your schedule (every ${schedule.frequencyDays === 1 ? 'day' : schedule.frequencyDays + ' days'}) might drown it!`;
    }
    
    return null;
  };

  const scheduleWarning = getScheduleWarning();

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
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

      {/* Flickering Dark Mode Overlay (Only for 'dark' mood, not 'sleeping') */}
      {mood === 'dark' && (
         <div className="absolute inset-0 bg-black/40 animate-flicker pointer-events-none z-20 mix-blend-multiply"></div>
      )}

      {/* Sleeping Overlay */}
      {mood === 'sleeping' && (
         <div className="absolute inset-0 bg-indigo-950/60 pointer-events-none z-20 mix-blend-multiply"></div>
      )}

      {/* Main LCD Display Container */}
      <div className="z-10 w-full max-w-md bg-black/60 backdrop-blur-xl border-4 border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative min-h-[600px]">
        
        {/* Animated GIF Background Layer */}
        <MoodGif mood={mood} />

        {/* Header / Status Bar */}
        <div className="relative z-10 flex justify-between items-center p-4 border-b border-gray-800/50 bg-gray-900/40">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400 w-24">
            <Cpu size={14} />
            <span className="hidden sm:inline">RPi-Z-2W</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>

          {/* Center System Time */}
          <div className="flex-1 text-center">
             <span className="font-mono-display text-2xl text-green-500 tracking-widest drop-shadow-lg opacity-90">
               {currentTime}
             </span>
          </div>

          <div className="flex items-center gap-3 w-24 justify-end">
            <button 
              onClick={() => { setShowSchedule(!showSchedule); setShowCareTips(false); setShowControls(false); }}
              className={`transition-colors ${showSchedule ? 'text-purple-400' : 'text-gray-400 hover:text-purple-200'}`}
              title="Watering Schedule"
            >
              {isWateringDue ? <Bell size={18} className="animate-bounce text-yellow-500" /> : <Calendar size={18} />}
            </button>
             <button 
              onClick={() => { setShowCareTips(!showCareTips); setShowSchedule(false); setShowControls(false); }}
              className={`transition-colors ${showCareTips ? 'text-green-400' : 'text-gray-400 hover:text-green-200'}`}
              title="Care Tips"
            >
              <Sprout size={18} />
            </button>
            <button 
              onClick={() => { setShowControls(!showControls); setShowSchedule(false); setShowCareTips(false); }}
              className={`transition-colors ${showControls ? 'text-blue-400' : 'text-gray-400 hover:text-white'}`}
              title="Settings / Simulation"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
          
          {isWateringDue && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-500 text-black px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce shadow-lg">
              <Bell size={12} />
              Watering Time!
            </div>
          )}

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
            
            {/* Plant Type Badge */}
            <div className="text-[10px] bg-gray-800/80 px-2 py-0.5 rounded-full text-gray-300 flex items-center gap-1 border border-gray-700">
              <Leaf size={10} />
              {PLANT_DATABASE.find(p => p.id === currentSpeciesId)?.name || "Custom Plant"}
            </div>

            {/* Growth Progress Bar */}
            <div className="w-32 flex flex-col gap-1 items-center mt-1" title={`XP: ${xp}`}>
              <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
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
            status={sensorData.moisture < thresholds.moisture.low || sensorData.moisture > thresholds.moisture.high ? 'danger' : 'good'}
          />
          <SensorCard 
            icon={<Thermometer size={20} />}
            label="Temp"
            value={sensorData.temperature}
            unit="°C"
            status={sensorData.temperature < thresholds.temperature.low || sensorData.temperature > thresholds.temperature.high ? 'danger' : 'good'}
          />
          <SensorCard 
            icon={<Sun size={20} />}
            label="Light"
            value={sensorData.light}
            unit="lx"
            status={sensorData.light < thresholds.light.low || sensorData.light > thresholds.light.high ? 'warning' : 'good'}
          />
        </div>

        {/* Collapsible Watering Schedule Section */}
        {showSchedule && (
          <div className="relative z-20 bg-purple-900/90 p-4 border-t border-purple-700 animate-in slide-in-from-bottom duration-300">
             <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-purple-100 flex items-center gap-2">
                <Calendar size={16} /> Watering Schedule
              </h3>
              <label className="flex items-center gap-2 text-xs cursor-pointer">
                <span className="text-purple-200">Enable</span>
                <input 
                  type="checkbox" 
                  checked={schedule.enabled}
                  onChange={(e) => setSchedule(prev => ({ ...prev, enabled: e.target.checked }))}
                  className="rounded bg-gray-700 border-gray-600 text-purple-500 focus:ring-purple-500"
                />
              </label>
            </div>
            
            {/* Smart Warning Popup */}
            {scheduleWarning && (
               <div className="mb-3 bg-yellow-500/20 border border-yellow-500 text-yellow-200 p-2 rounded text-xs flex gap-2 items-start">
                 <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                 <p>{scheduleWarning}</p>
               </div>
            )}

            <div className={`grid grid-cols-3 gap-2 transition-opacity ${!schedule.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
              <div>
                <label className="block text-[10px] text-purple-300 mb-1">Start Day</label>
                <select 
                  value={schedule.day}
                  onChange={(e) => setSchedule(prev => ({...prev, day: e.target.value}))}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                    <option key={day} value={day}>{day.substring(0, 3)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-purple-300 mb-1">Frequency</label>
                <select 
                  value={schedule.frequencyDays}
                  onChange={(e) => setSchedule(prev => ({...prev, frequencyDays: Number(e.target.value) as WateringFrequency}))}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400"
                >
                  <option value={1}>Daily</option>
                  <option value={2}>Every 2 days</option>
                  <option value={3}>Every 3 days</option>
                  <option value={4}>Every 4 days</option>
                  <option value={7}>Weekly</option>
                  <option value={14}>Bi-weekly</option>
                  <option value={30}>Monthly</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-purple-300 mb-1 flex items-center gap-1"><Clock size={10}/> Time</label>
                 <input 
                  type="time" 
                  value={schedule.time}
                  onChange={(e) => setSchedule(prev => ({...prev, time: e.target.value}))}
                  className="w-full bg-gray-800/50 border border-purple-500/30 rounded p-2 text-xs text-white focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>
            
             {isWateringDue && (
               <div className="mt-4 flex justify-center">
                  <button 
                    onClick={() => setIsWateringDue(false)}
                    className="bg-purple-500 hover:bg-purple-400 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md transition-colors"
                  >
                    I Watered It!
                  </button>
               </div>
             )}
          </div>
        )}

        {/* Collapsible Care Tips Section */}
        {showCareTips && (
          <div className="relative z-20 bg-green-900/90 p-4 border-t border-green-700 animate-in slide-in-from-bottom duration-300">
            <h3 className="font-bold text-green-100 flex items-center gap-2 mb-2">
              <Sprout size={16} /> Care Guide: {mood.charAt(0).toUpperCase() + mood.slice(1)}
            </h3>
            <p className="text-sm text-green-50 leading-relaxed">
              {CARE_TIPS[mood]}
            </p>
            <p className="text-xs text-green-300 mt-2 border-t border-green-700/50 pt-2">
               Configured for: {PLANT_DATABASE.find(p => p.id === currentSpeciesId)?.name}
            </p>
          </div>
        )}

        {/* Collapsible Settings & Plant Selector */}
        {showControls && (
          <div className="relative z-20 bg-gray-800/95 p-4 border-t border-gray-700 animate-in slide-in-from-bottom duration-300">
            
            {/* Plant Species Selector */}
            <div className="mb-4 pb-4 border-b border-gray-700">
               <h3 className="font-bold text-gray-300 flex items-center gap-2 mb-2">
                 <Leaf size={16} className="text-green-500" /> Plant Setup
               </h3>
               <select 
                  value={currentSpeciesId}
                  onChange={(e) => handleSpeciesChange(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:border-green-500 outline-none"
               >
                 {PLANT_DATABASE.map(species => (
                   <option key={species.id} value={species.id}>{species.name}</option>
                 ))}
               </select>
               <p className="text-[10px] text-gray-400 mt-1 italic">
                 {PLANT_DATABASE.find(p => p.id === currentSpeciesId)?.description}
               </p>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-300 flex items-center gap-2">
                <Settings size={16} /> Sensor Simulation
              </h3>
              <div className="flex gap-2">
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
                  <span>Moisture ({sensorData.moisture}%)</span>
                  <span className="text-[10px] text-gray-600">
                    Target: {thresholds.moisture.low}-{thresholds.moisture.high}%
                  </span>
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
                  <span>Temperature ({sensorData.temperature}°C)</span>
                  <span className="text-[10px] text-gray-600">
                    Target: {thresholds.temperature.low}-{thresholds.temperature.high}°C
                  </span>
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
                  <span>Light ({sensorData.light} lx)</span>
                  <span className="text-[10px] text-gray-600">
                    Target: {thresholds.light.low}-{thresholds.light.high} lx
                  </span>
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
