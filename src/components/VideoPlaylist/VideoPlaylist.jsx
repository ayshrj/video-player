import React, { useEffect } from "react";
import "./VideoPlaylist.css";
import VideoItem from "../../utils/VideoPlaylist/VideoItem";

const VideoPlaylist = ({
  videos,
  setVideos,
  currentVideoSelected,
  setCurrentVideoSelected,
  currentTime,
}) => {
  const moveVideo = (dragIndex, hoverIndex) => {
    const dragVideo = videos[dragIndex];
    const updatedVideos = [...videos];
    updatedVideos.splice(dragIndex, 1);
    updatedVideos.splice(hoverIndex, 0, dragVideo);
    setVideos(updatedVideos);

    // Update currentVideoSelected if necessary
    if (currentVideoSelected !== null) {
      let updatedSelectedIndex = currentVideoSelected;
      if (
        dragIndex < currentVideoSelected &&
        hoverIndex >= currentVideoSelected
      ) {
        updatedSelectedIndex--;
      } else if (
        dragIndex > currentVideoSelected &&
        hoverIndex <= currentVideoSelected
      ) {
        updatedSelectedIndex++;
      }
      setCurrentVideoSelected(updatedSelectedIndex);
    }
  };

  const removeVideo = (index) => {
    const updatedVideos = [...videos];
    updatedVideos.splice(index, 1);
    setVideos(updatedVideos);
    if (currentVideoSelected) {
      if (currentVideoSelected === index) {
        setCurrentVideoSelected(null);
      } else if (currentVideoSelected > index) {
        setCurrentVideoSelected(currentVideoSelected - 1);
      }
    }
  };

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

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      file,
      lastTime: 0,
    }));
    setVideos((prevVideos) => [...prevVideos, ...newFiles]);
  };

  useEffect(() => {
    console.log("videos: ", videos);
  }, [videos]);

  return (
    <div className="playlist-container">
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
      <input
        type="file"
        accept="video/*"
        multiple
        onChange={handleFileChange}
        className="playlist-video"
        id="video-adder"
        style={{ display: "none" }}
      />
      <label className="playlist-video" htmlFor="video-adder">
        Add Video
      </label>
    </div>
  );
};

export default VideoPlaylist;
