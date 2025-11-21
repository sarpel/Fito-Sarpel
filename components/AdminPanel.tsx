
import React from 'react';
import { Settings, RefreshCw, Leaf, Droplets, Thermometer, Sun, Calendar, Clock, AlertTriangle, Volume2, VolumeX } from 'lucide-react';
import { PlantSpecies, SensorData, SensorThresholds, WateringSchedule, WateringFrequency } from '../types';
import { PLANT_DATABASE } from '../data/plantDatabase';

interface AdminPanelProps {
  sensorData: SensorData;
  setSensorData: (data: SensorData) => void;
  thresholds: SensorThresholds;
  currentSpeciesId: string;
  onSpeciesChange: (id: string) => void;
  nickname: string;
  setNickname: (name: string) => void;
  schedule: WateringSchedule;
  setSchedule: (schedule: WateringSchedule) => void;
  isSimulationMode: boolean;
  setIsSimulationMode: (mode: boolean) => void;
  xp: number;
  onGrow: () => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  sensorData,
  setSensorData,
  thresholds,
  currentSpeciesId,
  onSpeciesChange,
  nickname,
  setNickname,
  schedule,
  setSchedule,
  isSimulationMode,
  setIsSimulationMode,
  xp,
  onGrow,
  isMuted,
  setIsMuted
}) => {
  
  const handleSensorChange = (key: keyof SensorData, value: number) => {
    setSensorData({ ...sensorData, [key]: value });
  };

  const selectedSpecies = PLANT_DATABASE.find(p => p.id === currentSpeciesId);

  // Check for incompatibility between schedule and plant needs
  const showScheduleWarning = schedule.enabled && selectedSpecies && 
    schedule.frequencyDays < selectedSpecies.idealWateringFrequencyDays;

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 p-6 font-sans overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6">
        
        <header className="flex items-center justify-between pb-6 border-b border-gray-200">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="text-gray-600" /> PlantPals Admin
                </h1>
                <p className="text-gray-500 text-sm mt-1">Configuration & Remote Control</p>
            </div>
            <div className="text-right">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                    System Online
                </span>
            </div>
        </header>

        {/* Identity Section */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Leaf className="text-green-500" size={20} /> Identity & Species
            </h2>
            
            <div className="grid gap-4 md:grid-cols-2">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nickname</label>
                    <input 
                        type="text" 
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg"
                        placeholder="E.g., Sprout"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Plant Species</label>
                    <select 
                        value={currentSpeciesId}
                        onChange={(e) => onSpeciesChange(e.target.value)}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                    >
                        {PLANT_DATABASE.map(species => (
                        <option key={species.id} value={species.id}>{species.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedSpecies && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg border border-blue-100">
                    <p><strong>Bio:</strong> {selectedSpecies.description}</p>
                    <p className="mt-1 text-xs opacity-75">Ideal watering: Every {selectedSpecies.idealWateringFrequencyDays} days</p>
                </div>
            )}
        </section>

        {/* Watering Schedule */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Calendar className="text-purple-500" size={20} /> Watering Schedule
                </h2>
                <div className="flex items-center gap-4">
                    {/* Sound Toggle */}
                    <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded transition-colors ${isMuted ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}
                        title={isMuted ? "Unmute notifications" : "Mute notifications"}
                    >
                        {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                        {isMuted ? "Muted" : "Sound On"}
                    </button>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-sm font-bold text-gray-500">Active</span>
                        <div className="relative inline-block w-10 h-6 align-middle select-none">
                            <input 
                                type="checkbox" 
                                checked={schedule.enabled}
                                onChange={(e) => setSchedule({...schedule, enabled: e.target.checked})}
                                className="absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 checked:bg-purple-500 transition-all duration-300"
                            />
                            <span className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></span>
                        </div>
                    </label>
                </div>
            </div>

            {/* Warning for Overwatering */}
            {showScheduleWarning && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3 animate-pulse">
                    <AlertTriangle className="text-yellow-600 shrink-0 mt-0.5" size={18} />
                    <div className="text-sm text-yellow-800">
                        <strong>Caution:</strong> You are watering every {schedule.frequencyDays} days, but a {selectedSpecies.name.split('/')[0]} prefers every {selectedSpecies.idealWateringFrequencyDays} days. This may cause root rot!
                    </div>
                </div>
            )}

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-opacity ${!schedule.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Anchor Day</label>
                    <select 
                        value={schedule.day}
                        onChange={(e) => setSchedule({...schedule, day: e.target.value})}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                    >
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <option key={day} value={day}>{day}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Frequency</label>
                    <select 
                        value={schedule.frequencyDays}
                        onChange={(e) => setSchedule({...schedule, frequencyDays: Number(e.target.value) as WateringFrequency})}
                        className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                    >
                        <option value={1}>Daily</option>
                        <option value={2}>Every 2 days</option>
                        <option value={3}>Every 3 days</option>
                        <option value={7}>Weekly</option>
                        <option value={14}>Bi-weekly</option>
                        <option value={30}>Monthly</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Time</label>
                    <div className="flex items-center gap-2">
                        <Clock size={18} className="text-gray-400" />
                        <input 
                            type="time" 
                            value={schedule.time}
                            onChange={(e) => setSchedule({...schedule, time: e.target.value})}
                            className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg"
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Sensor Simulation */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Settings className="text-gray-600" size={20} /> Simulation & Testing
                </h2>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
                    <button 
                        onClick={() => setIsSimulationMode(false)}
                        className={`px-3 py-1 rounded-md text-xs font-bold ${!isSimulationMode ? 'bg-white shadow text-gray-800' : 'text-gray-500'}`}
                    >
                        Live
                    </button>
                    <button 
                        onClick={() => setIsSimulationMode(true)}
                        className={`px-3 py-1 rounded-md text-xs font-bold ${isSimulationMode ? 'bg-white shadow text-blue-600' : 'text-gray-500'}`}
                    >
                        Simulate
                    </button>
                </div>
            </div>

            <div className={`space-y-6 transition-all ${!isSimulationMode ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                {/* Moisture Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm text-gray-600 flex items-center gap-2">
                            <Droplets size={16} /> Moisture
                        </span>
                        <span className={`font-mono font-bold ${sensorData.moisture < thresholds.moisture.low ? 'text-red-500' : 'text-green-500'}`}>
                            {sensorData.moisture}%
                        </span>
                    </div>
                    <input 
                        type="range" min="0" max="100" 
                        value={sensorData.moisture}
                        onChange={(e) => handleSensorChange('moisture', parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Dry ({thresholds.moisture.low}%)</span>
                        <span>Wet ({thresholds.moisture.high}%)</span>
                    </div>
                </div>

                {/* Temp Slider */}
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm text-gray-600 flex items-center gap-2">
                            <Thermometer size={16} /> Temperature
                        </span>
                        <span className={`font-mono font-bold ${sensorData.temperature > thresholds.temperature.high ? 'text-red-500' : 'text-green-500'}`}>
                            {sensorData.temperature}°C
                        </span>
                    </div>
                    <input 
                        type="range" min="0" max="45" 
                        value={sensorData.temperature}
                        onChange={(e) => handleSensorChange('temperature', parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>

                 {/* Light Slider */}
                 <div>
                    <div className="flex justify-between mb-2">
                        <span className="font-bold text-sm text-gray-600 flex items-center gap-2">
                            <Sun size={16} /> Light
                        </span>
                        <span className="font-mono font-bold text-orange-500">
                            {sensorData.light} lx
                        </span>
                    </div>
                    <input 
                        type="range" min="0" max="1000" 
                        value={sensorData.light}
                        onChange={(e) => handleSensorChange('light', parseInt(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                    />
                </div>
            </div>
            
             <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Current XP: <span className="font-bold text-gray-900">{xp}</span>
                </div>
                <button 
                    onClick={onGrow}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-bold text-sm hover:bg-purple-200 flex items-center gap-2 transition-colors"
                >
                    <RefreshCw size={16} /> Force Growth Tick
                </button>
            </div>
        </section>

        <div className="text-center text-xs text-gray-400 mt-8 pb-8">
            PlantPals System v1.0 • Host: Raspberry Pi Zero 2W
        </div>
      </div>
    </div>
  );
};
