import React, { useEffect } from "react";
import "./VideoPlaylist.css";
import VideoItem from "../../utils/VideoPlaylist/VideoItem";
import { IconCrosshair } from "@tabler/icons-react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const VideoPlaylist = ({
  videos,
  setVideos,
  currentVideoSelected,
  setCurrentVideoSelected,
  currentTime,
}) => {
  // Function to handle the drag and drop of videos in the playlist
  const moveVideo = (dragIndex, hoverIndex) => {
    const dragVideo = videos[dragIndex];
    const updatedVideos = [...videos];
    updatedVideos.splice(dragIndex, 1);
    updatedVideos.splice(hoverIndex, 0, dragVideo);
    setVideos(updatedVideos);

    // Update currentVideoSelected if necessary
    if (currentVideoSelected !== null) {
      let updatedSelectedIndex = currentVideoSelected;
      if (dragIndex === currentVideoSelected) {
        // Dragging the currently selected video
        updatedSelectedIndex = hoverIndex;
      } else if (
        dragIndex < currentVideoSelected &&
        hoverIndex >= currentVideoSelected
      ) {
        // Moving a video from before to after the currently selected video
        updatedSelectedIndex--;
      } else if (
        dragIndex > currentVideoSelected &&
        hoverIndex <= currentVideoSelected
      ) {
        // Moving a video from after to before the currently selected video
        updatedSelectedIndex++;
      }
      setCurrentVideoSelected(updatedSelectedIndex);
    }
  };

  // Function to remove a video from the playlist
  const removeVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
    if (currentVideoSelected) {
      if (currentVideoSelected === index) {
        setCurrentVideoSelected(-1);
      } else if (currentVideoSelected > index) {
        setCurrentVideoSelected(currentVideoSelected - 1);
      } else {
        setCurrentVideoSelected(-1);
      }
    }
  };

  // Function to select a video from the playlist
  const selectVideo = (index) => {
    if (currentVideoSelected) {
      setVideos((prevVideos) => {
        let newVideos = [...prevVideos];

        newVideos[currentVideoSelected] = {
          ...newVideos[currentVideoSelected],
          lastTime: currentTime,
        };

        return newVideos;
      });
    }
    setCurrentVideoSelected(index);
  };

  // Function to handle the addition of new videos to the playlist
  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      lastTime: 0,
    }));
    setVideos((prevVideos) => [...prevVideos, ...newFiles]);
  };

  // useEffect(() => {
  //   console.log("videos: ", videos);
  // }, [videos]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="playlist-container">
        <input
          type="file"
          accept="video/*"
          multiple
          onChange={handleFileChange}
          id="video-adder"
          style={{ display: "none" }}
        />
        <label
          className="playlist-video add-videos-button"
          htmlFor="video-adder"
        >
          <IconCrosshair stroke={2} /> Add Video/s
        </label>
        <div className="video-name-container">
          {videos.map((video, i) => (
            <VideoItem
              key={i}
              video={video}
              index={i}
              moveVideo={moveVideo}
              removeVideo={removeVideo}
              selectVideo={selectVideo}
              isSelected={currentVideoSelected === i}
              videos={videos}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default VideoPlaylist;
