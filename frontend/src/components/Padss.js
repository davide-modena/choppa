import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './Pads.css';

const YouTubeAudioPlayer = () => {
  const playerRef = useRef(null);
  const [videoId, setVideoId] = useState('7FlvTU_7U4A'); // Stato per l'ID del video
  const [startTime, setStartTime] = useState(0); // Intervallo di secondi tra i pulsanti
  const [secInterval, setSecInterval] = useState(5); // Intervallo di secondi tra i pulsanti
  const [padCount, setPadCount] = useState(9); // Numero di pulsanti
  const [activePad, setActivePad] = useState(null); // Stato per il pulsante attivo

  const opts = {
    height: '0', // Nascondi il video
    width: '0',
    playerVars: {
      autoplay: 0, // Imposta autoplay a 0
      controls: 0,
      rel: 0, // Non mostrare video correlati
      modestbranding: 1, // Meno branding di YouTube
      enablejsapi: 1, // Abilita l'API JavaScript
    },
  };

  const onReady = (event) => {
    console.log("Video pronto!");
  };

  const playAudio = (startSeconds) => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.seekTo(startSeconds, true); // Usa true per scorrere direttamente
      playerRef.current.internalPlayer.playVideo();
    }
  };

  const handleButtonClick = (seconds) => {
    // Ferma il video e riproduci da capo anche se il pulsante è già attivo
    if (playerRef.current) {
      playerRef.current.internalPlayer.pauseVideo(); // Ferma la riproduzione
      playAudio(seconds); // Riproduci il video a partire dai secondi specificati
    }
  };

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };  

  // Mappatura dei tasti numerici ai pad
  const keyMap = {
    '7': 0,
    '8': 1,
    '9': 2,
    '4': 3,
    '5': 4,
    '6': 5,
    '1': 6,
    '2': 7,
    '3': 8,
  };

  const pads = []; // Array per i pulsanti

  // Popola l'array pads utilizzando un ciclo for
  for (let i = 0; i < padCount; i++) {
    pads.push(
      <div
        className={`pad ${activePad === i ? 'active' : ''}`} // Aggiungi classe attiva
        key={i}
        onClick={() => handleButtonClick(i * secInterval + startTime)} // Trigger handleButtonClick
      ></div>
    );
  }

  const handleVideoIdChange = (e) => {
    const url = e.target.value; // Ottieni l'URL dal campo di input
    const id = extractVideoId(url); // Estrai l'ID dall'URL
    setVideoId(id); // Aggiorna l'ID del video
  };
  const handleSecIntervalChange = (e) => {
    setSecInterval(Number(e.target.value)); // Aggiorna l'intervallo di secondi
  };

  const handleStartTimeChange = (e) => {
    setStartTime(Number(e.target.value)); // Aggiorna l'intervallo di secondi
  };

  const handleVideoIdSubmit = (e) => {
    e.preventDefault(); // Previeni il comportamento predefinito del form
    // Potresti voler aggiungere logica per verificare se l'ID video è valido
  };

  // Gestisci gli eventi della tastiera
  const handleKeyDown = (event) => {
    const key = event.key;
    if (keyMap[key] !== undefined) {
        const padIndex = keyMap[key];
        const seconds = startTime + keyMap[key] * secInterval;
        setActivePad(padIndex); // Imposta il pad attivo
        handleButtonClick(seconds); // Attiva il pad corrispondente
        setTimeout(() => setActivePad(null), 100);
    }
  };

  // Aggiungi e rimuovi l'event listener per i tasti
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [secInterval, startTime]); // Aggiungi secInterval come dipendenza

  return (
    <div className="container">
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        ref={playerRef}
      />
      <div className="pads">
        {pads} {/* Renderizza i pulsanti */}
      </div>
      <div className="controls">
        <label>
            Start Time (secondi):
            <input
                type="range"
                min="0"
                max="60"
                step="0.1"
                value={startTime}
                onChange={handleStartTimeChange}
            />
            {startTime}s
            <br/>
        </label>
        <label>
          Intervallo (secondi):
          <input
            type="range"
            min="1"
            max="30"
            step="0.1"
            value={secInterval}
            onChange={handleSecIntervalChange}
          />
          {secInterval}s
        </label>
        <form onSubmit={handleVideoIdSubmit}>
          <label>
            Video ID:
            <input
              type="text"
              value={videoId}
              onChange={handleVideoIdChange}
            />
          </label>
          <button type="submit">Cambia Video</button>
        </form>
      </div>
    </div>
  );
};

export default YouTubeAudioPlayer;