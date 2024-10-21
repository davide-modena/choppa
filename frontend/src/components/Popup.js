import React, { useState } from 'react';
import './Popup.css'; // Importa il CSS specifico

const Popup = ({ show, onClose, onSave }) => {
    const [ytLink, setYtLink] = useState('');
    const [startTime, setStartTime] = useState(0);
    const [endTime, setEndTime] = useState(0);
    const [selectedLoop, setSelectedLoop] = useState('loop1');
    const [bpm, setBpm] = useState(100);
    const [numPads, setNumPads] = useState(15);

    if (!show) {
        return null;
    }

    const handleSave = () => {
        const settings = {
            ytLink,
            startTime,
            endTime,
            selectedLoop,
            bpm,
            numPads,
        };
        onSave(settings);
        onClose();
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Settings</h2>
                <label>
                    YouTube Link:
                    <input type="text" value={ytLink} onChange={(e) => setYtLink(e.target.value)} />
                </label>
                <label>
                    Start Time (seconds):
                    <input type="number" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </label>
                <label>
                    End Time (seconds):
                    <input type="number" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </label>
                <label>
                    Select Drum Loop:
                    <select value={selectedLoop} onChange={(e) => setSelectedLoop(e.target.value)}>
                        <option value="loop1">Loop 1</option>
                        <option value="loop2">Loop 2</option>
                        <option value="loop3">Loop 3</option>
                    </select>
                </label>
                <label>
                    BPM:
                    <input type="number" value={bpm} onChange={(e) => setBpm(e.target.value)} />
                </label>
                <label>
                    Number of Pads:
                    <input type="number" value={numPads} onChange={(e) => setNumPads(e.target.value)} />
                </label>
                <div className="popup-buttons">
                    <button onClick={handleSave}>Save</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default Popup;
