import React, { useState } from 'react';
import Pads from './components/Pads';
import Popup from './components/Popup';
import Test from './components/Test';

function App() {
  // Imposta le impostazioni di default
  const [settings, setSettings] = useState({
      ytLink: '',
      videoId: '1Q-iti9HvAM',
      startTime: 24,
      endTime: 0,
      selectedLoop: 'loop1', // Loop di batteria predefinito
      bpm: 100, // BPM predefinito
      numPads: 15 // Numero di pad predefinito
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleIconClick = () => {
      setShowPopup(true);
  };

  // Aggiorna le impostazioni quando vengono salvate nel Popup
  const handleSaveSettings = (newSettings) => {
      setSettings(newSettings);
      console.log('Saved settings:', newSettings);
  };

  return (
      <div>
          {/* Passa le impostazioni come props a Pads */}
          <Pads settings={settings} />
          <Popup 
              show={showPopup} 
              onClose={() => setShowPopup(false)} 
              onSave={handleSaveSettings} 
          />
          {/* <Test /> */}
      </div>
  );
}

export default App;