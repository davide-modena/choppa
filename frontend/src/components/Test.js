import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';

const YouTubeAudioPlayer = () => {
  const playerRef = useRef(null);
  const videoId = '7FlvTU_7U4A'; // Sostituisci con l'ID del tuo video
  const [playing, setPlaying] = useState(null); // Stato per tenere traccia del video in riproduzione

  const opts = {
    height: '0', // Nascondi il video
    width: '0',
    playerVars: {
      autoplay: 0, // Imposta autoplay a 0, inizieremo manualmente
      controls: 0,
    },
  };

  const onReady = (event) => {
    // Inizia la riproduzione quando il video è pronto
    event.target.playVideo();
  };

  const playAudio = (startSeconds) => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.seekTo(startSeconds);
      playerRef.current.internalPlayer.playVideo();
      setPlaying(startSeconds); // Aggiorna lo stato con il tempo di inizio
    }
  };

  const handleButtonClick = (seconds) => {
    // Se il video è già in riproduzione, ferma gli altri
    if (playing !== seconds) {
      if (playerRef.current) {
        playerRef.current.internalPlayer.pauseVideo(); // Ferma la riproduzione
      }
      playAudio(seconds); // Riproduci il video a partire dai secondi specificati
    }
  };

  return (
    <div>
      <YouTube
        videoId={videoId}
        opts={opts}
        onReady={onReady}
        ref={playerRef}
      />
      <div>
        <button onClick={() => handleButtonClick(0)}>Riproduci da 0s</button>
        <button onClick={() => handleButtonClick(5)}>Riproduci da 5s</button>
        <button onClick={() => handleButtonClick(10)}>Riproduci da 10s</button>
        <button onClick={() => handleButtonClick(15)}>Riproduci da 15s</button>
      </div>
    </div>
  );
};

export default YouTubeAudioPlayer;
