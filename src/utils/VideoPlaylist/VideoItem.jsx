import React from "react";
import { useDrag, useDrop } from "react-dnd";

const VideoItem = ({
  video,
  index,
  moveVideo,
  removeVideo,
  selectVideo,
  isSelected,
  videos,
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

  return (
    <div
      ref={(node) => drag(drop(node))}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isSelected ? "red" : "transparent",
      }}
      className="playlist-video"
      onClick={() => selectVideo(index)}
    >
      <div className="video-name">{videos[index].file.name}</div>
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevents the selectVideo from firing when the button is clicked
          removeVideo(index);
        }}
        style={{ marginLeft: "10px" }}
      >
        X
      </div>
    </div>
  );
};

export default VideoItem;
