import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import "./App.css";
import VideoPlaylist from "./VideoPlaylist";

const App = () => {
  const [currentVideoSelected, setCurrentVideoSelected] = useState(null);
  return (
    <div>
      <h1>Video Player</h1>
      <div className=".video-player-container">
        <VideoPlayer
          currentVideoSelected={currentVideoSelected}
          setCurrentVideoSelected={setCurrentVideoSelected}
        />
      </div>
      <VideoPlaylist
        currentVideoSelected={currentVideoSelected}
        setCurrentVideoSelected={setCurrentVideoSelected}
      />
    </div>
  );
};

export default App;
