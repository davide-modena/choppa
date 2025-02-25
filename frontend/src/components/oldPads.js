import React, { useEffect, useState, useRef } from 'react';
import './Pads.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup';
import YouTube from 'react-youtube';

const Pads = ({ settings }) => {
    const playerRef = useRef(null);
    const videoId = settings.videoId; // Sostituisci con l'ID del tuo video
    const [totalSquares, setTotalSquares] = useState(settings.numPads);
    const [audioSegments, setAudioSegments] = useState([]); 
    const [videoDuration, setVideoDuration] = useState(0); // Durata del video
    const [playing, setPlaying] = useState(null);
    const audioRef = useRef(null);
    const columns = 3;
    const rows = Math.ceil(totalSquares / columns);
    const hue = 220;
    const minLightness = 30;
    const maxLightness = 80;
    const lightnessRange = maxLightness - minLightness;
    const lightnessStep = lightnessRange / totalSquares;

    const [squareSize, setSquareSize] = useState(getSquareSize());
    const [showPopup, setShowPopup] = useState(false);

    function getSquareSize() {
        const containerWidth = window.innerWidth * 0.8;
        const containerHeight = window.innerHeight * 0.8;
        return Math.min(containerWidth / columns, containerHeight / rows);
    }

    useEffect(() => {
        const handleResize = () => {
            setSquareSize(getSquareSize());
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [totalSquares]);

    // Calcola i segmenti audio quando le impostazioni cambiano
    useEffect(() => {
        const startTime = settings.startTime; 
        const endTime = settings.endTime; 
        const duration = endTime - startTime;
        const segmentDuration = duration / totalSquares; 
        const segments = [];

        for (let i = 0; i < totalSquares; i++) {
            segments.push({
                start: startTime + i * segmentDuration,
                end: startTime + (i + 1) * segmentDuration,
            });
        }

        setAudioSegments(segments); 
    }, [totalSquares, settings.startTime, settings.endTime]);

    const onReady = (event) => {
        // Salva la durata del video quando è pronto
        setVideoDuration(event.target.getDuration());
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
        if (playerRef.current) {
            playerRef.current.internalPlayer.pauseVideo(); // Ferma la riproduzione
        }
        playAudio(seconds); // Riproduci il video a partire dai secondi specificati
    };

    const handlePadClick = (segment) => {
        handleButtonClick(segment.start);
    };

    const handlePlayLoop = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    return (
        <div className="container">
            <YouTube
                videoId={videoId}
                opts={{
                    height: '0', 
                    width: '0',
                    playerVars: {
                        autoplay: 0, 
                        controls: 0,
                    },
                }}
                onReady={onReady}
                ref={playerRef}
            />
            <div className="grid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
                {audioSegments.map((segment, i) => {
                    const lightness = maxLightness - (i * lightnessStep);
                    return (
                        <div
                            key={i}
                            style={{
                                backgroundColor: `hsl(${hue}, 100%, ${lightness}%)`,
                                width: `${squareSize}px`,
                                height: `${squareSize}px`,
                                cursor: 'pointer'
                            }}
                            onClick={() => handlePadClick(segment)} // Riproduci il segmento del video
                        />
                    );
                })}
            </div>
            <div className="footer centered">
                <FontAwesomeIcon icon={faPlay} className="icon" onClick={handlePlayLoop} />
                <FontAwesomeIcon icon={faEllipsisVertical} className="icon right" onClick={() => setShowPopup(true)} />
            </div>

            <Popup
                show={showPopup}
                onClose={() => setShowPopup(false)}
                onSave={(newSettings) => {
                    setTotalSquares(newSettings.numPads);
                    settings.startTime = newSettings.startTime; 
                    settings.endTime = newSettings.endTime;
                }}
            />

            <audio
                ref={audioRef}
                src={`/drum-loops/${settings.selectedLoop}.mp3`}
                loop
            />
        </div>
    );
};

export default Pads;
