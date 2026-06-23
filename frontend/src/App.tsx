import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { MainArea } from './components/MainArea';

function App() {
    const [selectedVoice, setSelectedVoice] = useState('af_heart');

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-200">
            <Sidebar 
                selectedVoice={selectedVoice} 
                onSelectVoice={setSelectedVoice} 
            />
            <MainArea 
                selectedVoice={selectedVoice} 
            />
        </div>
    );
}

export default App;
