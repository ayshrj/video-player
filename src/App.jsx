import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import VideoPlaylist from "./components/VideoPlaylist/VideoPlaylist";
import "./App.css";
import "./ScrollBar.css";

const App = () => {
  const [currentVideoSelected, setCurrentVideoSelected] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videos, setVideos] = useState([]);

  return (
    <div className="app-container">
      <div className="video-player-container">
        <VideoPlayer
          currentVideoSelected={currentVideoSelected}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setCurrentVideoSelected={setCurrentVideoSelected}
          videos={videos}
        />
        <VideoPlaylist
          videos={videos}
          setVideos={setVideos}
          currentVideoSelected={currentVideoSelected}
          setCurrentVideoSelected={setCurrentVideoSelected}
          currentTime={currentTime}
        />
      </div>
    </div>
  );
};

export default App;
