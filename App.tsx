import React, { useState, useEffect, useCallback, useRef } from 'react';
import { PlantAvatar } from './components/PlantAvatar';
import { SensorCard } from './components/SensorCard';
import { generatePlantThought } from './services/geminiService';
import { SensorData, PlantState, PlantMood } from './types';
import { PLANT_THRESHOLDS, DEFAULT_SENSOR_DATA } from './constants';
import { Settings, Thermometer, Droplets, Sun, Cpu, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  // State for sensor readings
  const [sensorData, setSensorData] = useState<SensorData>(DEFAULT_SENSOR_DATA);
  
  // State for determined mood and AI thought
  const [mood, setMood] = useState<PlantMood>('happy');
  const [aiThought, setAiThought] = useState<string>("I'm just photosynthesizing...");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  // Simulation mode toggle (since we can't connect to real GPIO in browser)
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  const [showControls, setShowControls] = useState<boolean>(false);

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

  // AI Thought Generator Effect
  useEffect(() => {
    const now = Date.now();
    // Only fetch new thought if mood changed OR it's been at least 30 seconds to avoid spamming API
    const timeSinceLastUpdate = now - lastAiUpdateRef.current;
    
    if (timeSinceLastUpdate > 30000 || lastAiUpdateRef.current === 0) {
      fetchAiThought();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mood]); 

  const fetchAiThought = async () => {
    if (!process.env.API_KEY) return;
    
    setIsThinking(true);
    try {
      const thought = await generatePlantThought(sensorData, mood);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Ambient Glow based on Mood */}
      <div className={`absolute inset-0 opacity-20 transition-colors duration-1000 pointer-events-none 
        ${mood === 'happy' ? 'bg-green-500' : ''}
        ${mood === 'thirsty' ? 'bg-yellow-600' : ''}
        ${mood === 'drowning' ? 'bg-blue-700' : ''}
        ${mood === 'hot' || mood === 'scorched' ? 'bg-red-600' : ''}
        ${mood === 'freezing' ? 'bg-cyan-300' : ''}
        ${mood === 'dark' ? 'bg-gray-900' : ''}
      `} />

      {/* Main LCD Display Container - Styled to look like a 2inch screen if full screen, or a card on desktop */}
      <div className="z-10 w-full max-w-md bg-black/80 backdrop-blur-md border-4 border-gray-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header / Status Bar */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Cpu size={14} />
            <span>RPi-Zero-2W</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          </div>
          <button 
            onClick={() => setShowControls(!showControls)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-6 flex flex-col items-center gap-6 min-h-[400px]">
          
          {/* The Avatar */}
          <div className="flex-1 flex items-center justify-center w-full">
            <PlantAvatar mood={mood} />
          </div>

          {/* The AI Thought Bubble */}
          <div className="w-full bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/5 min-h-[100px] flex items-center justify-center text-center relative group">
            {isThinking ? (
               <div className="flex items-center gap-2 text-sm text-green-300 animate-pulse">
                 <RefreshCw size={16} className="animate-spin" />
                 <span>Consulting nature spirits...</span>
               </div>
            ) : (
              <p className={`font-mono-display text-xl md:text-2xl leading-tight ${
                mood === 'happy' ? 'text-green-300' : 'text-amber-300'
              }`}>
                "{aiThought}"
              </p>
            )}
            <button 
              onClick={fetchAiThought} 
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white/50 hover:text-white"
            >
              <RefreshCw size={12} />
            </button>
          </div>

          {/* Sensor Grid */}
          <div className="grid grid-cols-3 gap-3 w-full">
            <SensorCard 
              icon={<Droplets size={18} />}
              label="H2O"
              value={sensorData.moisture}
              unit="%"
              status={
                sensorData.moisture < PLANT_THRESHOLDS.moisture.low ? 'danger' :
                sensorData.moisture > PLANT_THRESHOLDS.moisture.high ? 'warning' : 'good'
              }
            />
            <SensorCard 
              icon={<Thermometer size={18} />}
              label="Temp"
              value={sensorData.temperature}
              unit="°C"
              status={
                sensorData.temperature < PLANT_THRESHOLDS.temperature.low ? 'danger' :
                sensorData.temperature > PLANT_THRESHOLDS.temperature.high ? 'danger' : 'good'
              }
            />
            <SensorCard 
              icon={<Sun size={18} />}
              label="Lux"
              value={sensorData.light}
              unit="lx"
              status={
                sensorData.light < PLANT_THRESHOLDS.light.low ? 'warning' :
                sensorData.light > PLANT_THRESHOLDS.light.high ? 'danger' : 'good'
              }
            />
          </div>
        </div>
      </div>

      {/* Simulation Controls (Hidden by default) */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 bg-gray-800 p-6 rounded-t-3xl z-20 border-t border-gray-600 animate-in slide-in-from-bottom shadow-xl max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-green-400">Hardware Simulation</h3>
            <button onClick={() => setShowControls(false)} className="text-sm text-gray-400 hover:text-white">Close</button>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs uppercase tracking-wider text-gray-400">
                <span>Soil Moisture</span>
                <span>{sensorData.moisture}%</span>
              </div>
              <input 
                type="range" min="0" max="100" 
                value={sensorData.moisture}
                onChange={(e) => handleSensorChange('moisture', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs uppercase tracking-wider text-gray-400">
                <span>Temperature</span>
                <span>{sensorData.temperature}°C</span>
              </div>
              <input 
                type="range" min="-5" max="50" 
                value={sensorData.temperature}
                onChange={(e) => handleSensorChange('temperature', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs uppercase tracking-wider text-gray-400">
                <span>Light Level</span>
                <span>{sensorData.light} lx</span>
              </div>
              <input 
                type="range" min="0" max="1000" step="10"
                value={sensorData.light}
                onChange={(e) => handleSensorChange('light', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
            </div>

            <div className="mt-4 p-3 bg-gray-900/50 rounded border border-gray-700 text-xs text-gray-400 font-mono">
              <p className="mb-1 text-green-400 font-bold">// HARDWARE SETUP INFO:</p>
              <p>1. Connect Capacitive Soil Sensor to ADC (MCP3008) or GPIO.</p>
              <p>2. Connect DHT22 to GPIO 4.</p>
              <p>3. Connect LDR to ADC.</p>
              <p>4. Run a local Python server to WebSocket these values to localhost:3000.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;