import React, { useRef, useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import './Pads.css';

const YouTubeAudioPlayer = () => {
  const playerRef = useRef(null);
  const [videoId, setVideoId] = useState('7FlvTU_7U4A');
  const [padTimes, setPadTimes] = useState(Array(9).fill(0));
  const [activePad, setActivePad] = useState(null);
  const [showVideoIdForm, setShowVideoIdForm] = useState(false);

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

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
      rel: 0,
      modestbranding: 1,
      enablejsapi: 1,
    },
  };

  const onReady = (event) => {
    console.log("Video pronto!");
  };

  const playAudio = (startSeconds) => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.seekTo(startSeconds, true);
      playerRef.current.internalPlayer.playVideo();
    }
  };

  const handleButtonClick = (index) => {
    const startTime = padTimes[index];
    if (playerRef.current) {
      playerRef.current.internalPlayer.pauseVideo();
      playAudio(startTime);
      setActivePad(index);
      setTimeout(() => setActivePad(null), 100);
    }
  };

  const handlePadTimeChange = (index, value) => {
    const newTimes = [...padTimes];
    newTimes[index] = Number(value);
    setPadTimes(newTimes);
  };

  const handleKeyDown = (event) => {
    const padIndex = keyMap[event.key];
    if (padIndex !== undefined && padIndex < padTimes.length) {
      handleButtonClick(padIndex);
    }
  };

  const handleVideoIdSubmit = (e) => {
    e.preventDefault();
  };

  const handleVideoIdChange = (e) => {
    const url = e.target.value;
    const id = extractVideoId(url);
    if (id) setVideoId(id);
  };

  const extractVideoId = (url) => {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^&\n]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : null;
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [padTimes]);

  return (
    <div className="container">
      <YouTube videoId={videoId} opts={opts} onReady={onReady} ref={playerRef} />
      <div className="pads">
        {padTimes.map((time, index) => (
          <div key={index} className={`pad ${activePad === index ? 'active' : ''}`} onClick={() => handleButtonClick(index)}>
            <input
              type="number"
              value={time}
              onChange={(e) => handlePadTimeChange(index, e.target.value)}
              placeholder="Secondi"
              step="0.1"
            />
          </div>
        ))}
      </div>
      <div className="controls">
        <button onClick={() => setShowVideoIdForm(!showVideoIdForm)}>
          {showVideoIdForm ? 'Hide' : 'Change Video ID'}
        </button>
        {showVideoIdForm && (
          <form onSubmit={handleVideoIdSubmit} className="video-id-form">
            <label>
              Video ID:
              <input
                type="text"
                value={videoId}
                onChange={handleVideoIdChange}
              />
            </label>
            <button type="submit">Change Video</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default YouTubeAudioPlayer;