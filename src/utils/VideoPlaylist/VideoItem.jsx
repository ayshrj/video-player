import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { IconGripVertical, IconX } from "@tabler/icons-react";

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
      ref={drop}
      style={{
        // opacity: isDragging ? 0.5 : 1,
        backgroundColor: !isSelected ? "transparent" : "red",
      }}
      className="playlist-video"
      onClick={() => selectVideo(index)}
    >
      <div className="playlist-video-name">
        <div className="playlist-video-drag" ref={drag}>
          <IconGripVertical stroke={2} />
        </div>
        {videos[index].file.name}
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation(); // Prevents the selectVideo from firing when the button is clicked
          removeVideo(index);
        }}
        style={{ marginLeft: "10px" }}
      >
        <IconX stroke={2} />
      </div>
    </div>
  );
};

export default VideoItem;
