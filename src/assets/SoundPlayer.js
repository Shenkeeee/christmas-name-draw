import React, { useRef, useState } from "react";
import bgmusic from "./sounds/backgroundMusic1.mp3";

const SoundPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleSound = () => {
    audioRef.current.volume = 0.3;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="sound-wrapper">
      <button onClick={toggleSound}>
        {isPlaying ?  (<span>&#128266;</span>) : (<span>&#128264;</span>)}
      </button>
      <audio ref={audioRef} src={bgmusic} >
        Audio not supported, sorry!
      </audio>
    </div>
  );
};

export default SoundPlayer;
