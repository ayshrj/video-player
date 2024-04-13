import React, { useEffect, useState } from "react";
import {
  IconChevronUp,
  IconChevronDown,
  IconMaximize,
  IconMinimize,
  IconVolume,
  IconVolume2,
  IconVolume3,
  IconVolumeOff,
  IconRewindForward10,
  IconRewindBackward10,
  IconPictureInPicture,
} from "@tabler/icons-react";

const VideoButtons = ({
  controlsVisible,
  playIcon,
  currentTime,
  duration,
  volume,
  isMuted,
  setIsMuted,
  fullscreenOpen,
  currentSpeed,
  togglePlay,
  handleSeek,
  setVolume,
  setCurrentSpeed,
  setFullscreenOpen,
  videoRef,
  openSpeedOption,
  setOpenSpeedOption,
}) => {
  // State to manage the visibility of the volume slider
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

  // Utility function to format seconds into a time string format
  const formatTime = (seconds) => {
    if (seconds < 60) {
      return `0:${seconds.toString().padStart(2, "0")}`;
    } else if (seconds >= 60 && seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours}:${remainingMinutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    }
  };

  // Toggles the mute state of the video
  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }
  };

  // Logs changes in control visibility, can be used for debugging
  // useEffect(() => {
  //   console.log(controlsVisible);
  // }, [controlsVisible]);

  // Toggle fullscreen mode for the video player
  const toggleFullscreen = () => {
    const container = videoRef.current.parentNode;
    if (!document.fullscreenElement) {
      setFullscreenOpen(true);
      // Fullscreen request for cross-browser support
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      setFullscreenOpen(false);
      // Exit fullscreen for cross-browser support
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  // Toggle Picture-in-Picture mode
  const togglePictureInPicture = () => {
    const videoElement = videoRef.current;

    if (!document.pictureInPictureElement) {
      if (videoElement.requestPictureInPicture) {
        videoElement.requestPictureInPicture().catch((error) => {
          console.error("Picture-in-Picture Error:", error);
        });
      }
    } else {
      if (document.exitPictureInPicture) {
        document.exitPictureInPicture().catch((error) => {
          console.error("Exit Picture-in-Picture Error:", error);
        });
      }
    }
  };

  // Handles volume changes from the slider
  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    setShowVolumeSlider(true); // Keep slider visible while adjusting
  };

  // Handles rewind action for the video
  const handleRewind = () => {
    if (videoRef.current) {
      const newTime = Math.max(0, videoRef.current.currentTime - 10);
      videoRef.current.currentTime = newTime;
    }
  };

  // Handles forward action for the video
  const handleForward = () => {
    if (videoRef.current) {
      const newTime = Math.min(
        videoRef.current.duration,
        videoRef.current.currentTime + 10
      );
      videoRef.current.currentTime = newTime;
    }
  };

  return (
    <div className="video-buttons">
      <div
        className={`play-button ${!controlsVisible ? "hide-buttons" : ""}`}
        onClick={togglePlay}
      >
        {playIcon}
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={(currentTime / duration) * 100 || 0}
        onChange={handleSeek}
        className={`seek-button input-slider ${
          !controlsVisible ? "hide-buttons" : ""
        }`}
      />
      <div className={`left-buttons ${!controlsVisible ? "hide-buttons" : ""}`}>
        <span>
          {formatTime(currentTime.toFixed(0))} /{" "}
          {formatTime(duration.toFixed(0))}
        </span>
        <div className="rewind-button">
          <IconRewindBackward10 stroke={2} onClick={handleRewind} />
          <IconRewindForward10 stroke={2} onClick={handleForward} />
        </div>
        <div
          className="volume"
          onMouseEnter={() => setShowVolumeSlider(true)}
          onMouseLeave={() => setShowVolumeSlider(false)}
        >
          {isMuted ? (
            <IconVolumeOff onClick={toggleMute} />
          ) : volume >= 50 ? (
            <IconVolume
              onClick={toggleMute}
              color={isMuted ? "gray" : "white"}
            />
          ) : volume > 0 ? (
            <IconVolume2
              onClick={toggleMute}
              color={isMuted ? "gray" : "white"}
            />
          ) : (
            <IconVolume3
              onClick={toggleMute}
              color={isMuted ? "gray" : "white"}
            />
          )}
          {!isMuted && showVolumeSlider && (
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider input-slider"
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
            />
          )}
        </div>
      </div>
      <div
        className={`right-buttons ${!controlsVisible ? "hide-buttons" : ""}`}
      >
        <div className="pict-in-pict" onClick={togglePictureInPicture}>
          <IconPictureInPicture stroke="2" />
        </div>
        <div className="fullscreen" onClick={toggleFullscreen}>
          {!fullscreenOpen ? (
            <IconMaximize color="white" />
          ) : (
            <IconMinimize color="white" />
          )}
        </div>
        <div className="speed">
          {openSpeedOption && (
            <div className="speed-options">
              <div
                onClick={() => setCurrentSpeed("0.5")}
                style={{
                  backgroundColor: currentSpeed === "0.5" ? "red" : "",
                }}
                className="speed-option"
              >
                0.5x
              </div>
              <div
                onClick={() => setCurrentSpeed("1.0")}
                style={{
                  backgroundColor: currentSpeed === "1.0" ? "red" : "",
                }}
                className="speed-option"
              >
                1.0x
              </div>
              <div
                onClick={() => setCurrentSpeed("1.5")}
                style={{
                  backgroundColor: currentSpeed === "1.5" ? "red" : "",
                }}
                className="speed-option"
              >
                1.5x
              </div>
              <div
                onClick={() => setCurrentSpeed("2.0")}
                style={{
                  backgroundColor: currentSpeed === "2.0" ? "red" : "",
                }}
                className="speed-option"
              >
                2.0x
              </div>
            </div>
          )}
          <div
            onClick={() => {
              setOpenSpeedOption(!openSpeedOption);
            }}
            className="speed-selector"
          >
            <div>{`${currentSpeed}x`}</div>
            <div>
              {!openSpeedOption ? <IconChevronUp /> : <IconChevronDown />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoButtons;
