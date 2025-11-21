
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generatePlantThought } from './services/geminiService';
import { SensorData, PlantMood, PlantStage, WateringSchedule, SensorThresholds, WateringFrequency } from './types';
import { DEFAULT_SENSOR_DATA, GROWTH_CONFIG, WATER_DROP_SOUND_URL } from './constants';
import { config } from './plantConfig';
import { PLANT_DATABASE } from './data/plantDatabase';
import { DisplayScreen } from './components/DisplayScreen';
import { AdminPanel } from './components/AdminPanel';

const App: React.FC = () => {
  // --- ROUTING STATE ---
  const [viewMode, setViewMode] = useState<'display' | 'admin'>('display');

  // --- SHARED APPLICATION STATE ---
  
  // Sensor & Config
  const [sensorData, setSensorData] = useState<SensorData>(DEFAULT_SENSOR_DATA);
  const [currentSpeciesId, setCurrentSpeciesId] = useState<string>("custom");
  const [thresholds, setThresholds] = useState<SensorThresholds>(config.thresholds);
  
  // Identity & Mood
  const [mood, setMood] = useState<PlantMood>('happy');
  const [nickname, setNickname] = useState<string>("Sprout");
  const [aiThought, setAiThought] = useState<string>("I'm just photosynthesizing...");
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  // Growth
  const [xp, setXp] = useState<number>(0);
  const [stage, setStage] = useState<PlantStage>(1);

  // Schedule
  const [schedule, setSchedule] = useState<WateringSchedule>({ 
    day: 'Monday', 
    time: '09:00', 
    frequencyDays: 7, 
    enabled: false 
  });
  const [isWateringDue, setIsWateringDue] = useState<boolean>(false);

  // System Time
  const [currentTime, setCurrentTime] = useState<string>(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  // Settings
  const [isSimulationMode, setIsSimulationMode] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Refs
  const lastAiUpdateRef = useRef<number>(0);

  // --- ROUTING LOGIC ---
  useEffect(() => {
    const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === '#admin') {
            setViewMode('admin');
        } else {
            setViewMode('display');
        }
    };

    // Initial check
    handleHashChange();

    // Listener
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);


  // --- CORE LOGIC ---

  const isDaytime = () => {
    const hour = new Date().getHours();
    return hour >= 7 && hour < 20;
  };
  
  const determineMood = useCallback((data: SensorData): PlantMood => {
    const { moisture, temperature, light } = data;
    const t = thresholds; 

    if (moisture > t.moisture.high) return 'drowning';
    if (temperature < t.temperature.low) return 'freezing';
    if (temperature > t.temperature.high) return 'hot';
    if (light > t.light.high) return 'scorched';
    if (isWateringDue) return 'thirsty';
    if (moisture < t.moisture.low) return 'thirsty';
    
    if (light < t.light.low) {
      if (!isDaytime()) return 'sleeping';
      return 'dark'; 
    }

    return 'happy';
  }, [isWateringDue, thresholds]);

  // Mood Update Effect
  useEffect(() => {
    const newMood = determineMood(sensorData);
    setMood(newMood);
  }, [sensorData, determineMood, currentTime]);

  // Species Selection Handler
  const handleSpeciesChange = (speciesId: string) => {
    const selected = PLANT_DATABASE.find(p => p.id === speciesId);
    if (selected) {
      setCurrentSpeciesId(selected.id);
      setThresholds(selected.thresholds);
      if (nickname === "Sprout" && selected.id !== 'custom') {
        setNickname(selected.name.split(' ')[0]);
      }
    }
  };

  // Time Ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Schedule Checker
  useEffect(() => {
    if (!schedule.enabled) return;
    const checkInterval = setInterval(() => {
      const now = new Date();
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[now.getDay()];
      const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      if (currentDay === schedule.day && currentTimeStr === schedule.time && !isWateringDue) {
        setIsWateringDue(true);
      }
    }, 10000); 
    return () => clearInterval(checkInterval);
  }, [schedule, isWateringDue]);

  // Watering Notification Sound
  useEffect(() => {
    if (isWateringDue && !isMuted) {
      const audio = new Audio(WATER_DROP_SOUND_URL);
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio playback prevented:", e));
    }
  }, [isWateringDue, isMuted]);

  // Auto-Dismiss Watering Alert
  useEffect(() => {
    if (isWateringDue && sensorData.moisture > thresholds.moisture.low + 10) {
      setIsWateringDue(false);
    }
  }, [sensorData.moisture, isWateringDue, thresholds]);

  // Helper for growth stage update
  const calculateStage = (currentXp: number): PlantStage => {
      if (currentXp >= GROWTH_CONFIG.THRESHOLDS[4]) return 4;
      else if (currentXp >= GROWTH_CONFIG.THRESHOLDS[3]) return 3;
      else if (currentXp >= GROWTH_CONFIG.THRESHOLDS[2]) return 2;
      return 1;
  };

  // Growth Logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (mood === 'happy') {
      interval = setInterval(() => {
        setXp((prevXp) => {
          const newXp = prevXp + GROWTH_CONFIG.XP_PER_TICK;
          const newStage = calculateStage(newXp);
          setStage(prevStage => newStage !== prevStage ? newStage : prevStage);
          return newXp;
        });
      }, GROWTH_CONFIG.TICK_RATE_MS);
    }
    return () => clearInterval(interval);
  }, [mood]);

  // AI Thought Logic
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

  // Handlers
  const handleForceGrow = () => {
    setXp(prevXp => {
      const newXp = prevXp + 20;
      const newStage = calculateStage(newXp);
      // We need to update stage as well, but we can't do it inside setXp purely safely without this specific pattern
      // Since setStage is async, we just fire it.
      setStage(newStage);
      return newXp;
    });
  };

  // --- RENDER ---

  if (viewMode === 'admin') {
    return (
        <AdminPanel 
            sensorData={sensorData}
            setSensorData={setSensorData}
            thresholds={thresholds}
            currentSpeciesId={currentSpeciesId}
            onSpeciesChange={handleSpeciesChange}
            nickname={nickname}
            setNickname={setNickname}
            schedule={schedule}
            setSchedule={setSchedule}
            isSimulationMode={isSimulationMode}
            setIsSimulationMode={setIsSimulationMode}
            xp={xp}
            onGrow={handleForceGrow}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
        />
    );
  }

  return (
    <DisplayScreen 
        mood={mood}
        sensorData={sensorData}
        thresholds={thresholds}
        aiThought={aiThought}
        isThinking={isThinking}
        stage={stage}
        nickname={nickname}
        currentSpecies={PLANT_DATABASE.find(p => p.id === currentSpeciesId)}
        currentTime={currentTime}
        isWateringDue={isWateringDue}
    />
  );
};

export default App;
