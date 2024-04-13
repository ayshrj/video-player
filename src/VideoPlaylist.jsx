import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useDrag, useDrop } from "react-dnd";

const VideoItem = ({
  video,
  index,
  moveVideo,
  removeVideo,
  selectVideo,
  isSelected,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "video",
    item: () => {
      return { index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "video",
    hover(item, monitor) {
      if (item.index !== index) {
        moveVideo(item.index, index);
        item.index = index;
      }
    },
  });

  const itemStyle = {
    opacity: isDragging ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    backgroundColor: isSelected ? "red" : "transparent", // Set background color based on selection
    cursor: "pointer",
    padding: "10px",
    margin: "5px",
    border: "1px solid #ccc",
  };

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={itemStyle}
      onClick={() => selectVideo(video)}
    >
      {video.name}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevents the selectVideo from firing when the button is clicked
          removeVideo(index);
        }}
        style={{ marginLeft: "10px" }}
      >
        X
      </button>
    </div>
  );
};

const VideoPlaylist = ({ currentVideoSelected, setCurrentVideoSelected }) => {
  const [videos, setVideos] = useState([]);

  const moveVideo = (dragIndex, hoverIndex) => {
    const dragVideo = videos[dragIndex];
    const updatedVideos = [...videos];
    updatedVideos.splice(dragIndex, 1);
    updatedVideos.splice(hoverIndex, 0, dragVideo);
    setVideos(updatedVideos);
  };

  const removeVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
    if (currentVideoSelected && currentVideoSelected === videos[index]) {
      setCurrentVideoSelected(null); // Reset if the current selected video is removed
    }
  };

  const selectVideo = (video) => {
    setCurrentVideoSelected(video);
    // console.log("selected video", video);
  };

  const handleFileChange = (event) => {
    setVideos([...videos, ...Array.from(event.target.files)]);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
      />
      <div>
        {videos.map((video, i) => (
          <VideoItem
            key={i}
            video={video}
            index={i}
            moveVideo={moveVideo}
            removeVideo={removeVideo}
            selectVideo={selectVideo}
            isSelected={currentVideoSelected && currentVideoSelected === video}
          />
        ))}
      </div>
      {currentVideoSelected && (
        <div>Selected Video: {currentVideoSelected.name}</div>
      )}
    </DndProvider>
  );
};

export default VideoPlaylist;
