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
  // useDrag hook setup for enabling drag functionality on video items
  const [{ isDragging }, drag] = useDrag({
    type: "video", // DnD type, used for matching drag sources and drop targets
    item: () => {
      return { index }; // The dragged item is identified by the video's index
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(), // Tracking the drag state to update component style
    }),
  });

  // useDrop hook setup for accepting drop actions and handling them
  const [, drop] = useDrop({
    accept: "video", // Only accept drops of 'video' type
    hover(item, monitor) {
      // Function to handle hover over a drop target
      if (item.index !== index) {
        // Check if the video is not being dropped onto itself
        moveVideo(item.index, index); // Reorder videos
        item.index = index; // Update the index of the dragged item to the new position
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
