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
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);

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

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }
  };

  useEffect(() => {
    console.log(controlsVisible);
  }, [controlsVisible]);

  const toggleFullscreen = () => {
    const container = videoRef.current.parentNode;
    if (!document.fullscreenElement) {
      setFullscreenOpen(true);
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

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    setShowVolumeSlider(true); // Keep slider visible while adjusting
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
        className={`fullscreen ${!controlsVisible ? "hide-buttons" : ""}`}
        onClick={toggleFullscreen}
      >
        {!fullscreenOpen ? (
          <IconMaximize color="white" />
        ) : (
          <IconMinimize color="white" />
        )}
      </div>
      <div className={`speed ${!controlsVisible ? "hide-buttons" : ""}`}>
        {openSpeedOption && (
          <>
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
          </>
        )}
        <div
          onClick={() => {
            setOpenSpeedOption(!openSpeedOption);
          }}
          className="speed-selector"
        >
          {`${currentSpeed}x`}
          {!openSpeedOption ? <IconChevronUp /> : <IconChevronDown />}
        </div>
      </div>
    </div>
  );
};

export default VideoButtons;
