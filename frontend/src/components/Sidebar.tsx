import React, { useState, useEffect } from 'react';
import { GetPythonVenvPath, SetPythonVenvPath } from '../../wailsjs/go/main/App';

const VOICES = [
    'af_heart', 'af_alloy', 'af_aoede', 'af_bella', 'af_jessica', 'af_kore',
    'af_nicole', 'af_nova', 'af_river', 'af_sky', 'am_adam', 'am_echo',
    'am_eric', 'am_fenrir', 'am_liam', 'am_michael', 'am_onyx', 'am_puck'
];

interface SidebarProps {
    selectedVoice: string;
    onSelectVoice: (voice: string) => void;
}

export function Sidebar({ selectedVoice, onSelectVoice }: SidebarProps) {
    const [showSettings, setShowSettings] = useState(false);
    const [venvPath, setVenvPath] = useState('');

    useEffect(() => {
        GetPythonVenvPath().then(setVenvPath).catch(console.error);
    }, []);

    const handleSaveSettings = () => {
        SetPythonVenvPath(venvPath).then(() => {
            setShowSettings(false);
        }).catch(console.error);
    };

    return (
        <div className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-full text-slate-300">
            <div className="p-4 border-b border-slate-800">
                <h1 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
                    Voice TTS
                </h1>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                <h2 className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-3">Voices</h2>
                {VOICES.map(voice => (
                    <button
                        key={voice}
                        onClick={() => onSelectVoice(voice)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                            selectedVoice === voice 
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                            : 'hover:bg-slate-800 text-slate-400 border border-transparent'
                        }`}
                    >
                        {voice}
                    </button>
                ))}
            </div>

            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={() => setShowSettings(true)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                >
                    <span>⚙️ Settings</span>
                </button>
            </div>

            {showSettings && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700 w-96 shadow-2xl">
                        <h3 className="text-lg font-semibold text-white mb-4">Settings</h3>
                        <div className="mb-4">
                            <label className="block text-sm text-slate-400 mb-2">Python Path / Venv Path</label>
                            <input 
                                type="text"
                                value={venvPath}
                                onChange={e => setVenvPath(e.target.value)}
                                placeholder="e.g. C:\path\to\venv"
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button 
                                onClick={() => setShowSettings(false)}
                                className="px-4 py-2 text-slate-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleSaveSettings}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
