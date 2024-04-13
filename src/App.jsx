import React, { useState } from "react";
import VideoPlayer from "./components/VideoPlayer/VideoPlayer";
import VideoPlaylist from "./components/VideoPlaylist/VideoPlaylist";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./App.css";

const App = () => {
  const [currentVideoSelected, setCurrentVideoSelected] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [videos, setVideos] = useState([]);

  return (
    <DndProvider backend={HTML5Backend}>
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
    </DndProvider>
  );
};

export default App;
