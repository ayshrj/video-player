import React, { useState } from "react";
import VideoPlayer from "./VideoPlayer";
import VideoPlaylist from "./VideoPlaylist";
import "./App.css"; // Import your CSS file

const App = () => {
  const [currentVideoSelected, setCurrentVideoSelected] = useState(null);
  return (
    <div className="app-container">
      {" "}
      {/* Apply any necessary styles to the app container */}
      <div className="video-player-container">
        <VideoPlayer
          currentVideoSelected={currentVideoSelected}
          setCurrentVideoSelected={setCurrentVideoSelected}
        />
        <VideoPlaylist
          currentVideoSelected={currentVideoSelected}
          setCurrentVideoSelected={setCurrentVideoSelected}
        />
      </div>
    </div>
  );
};

export default App;
