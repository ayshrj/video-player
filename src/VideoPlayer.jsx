import React, { useState, useRef, useEffect } from "react";
import "./VideoPlayer.css";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconChevronUp,
  IconChevronDown,
  IconMaximize,
  IconMinimize,
  IconVolume,
} from "@tabler/icons-react";

function VideoPlayer({ currentVideoSelected, setCurrentVideoSelected }) {
  // Existing states and refs
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState("1.0");
  const [openSpeedOption, setOpenSpeedOption] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const videoRef = useRef(null);
  const [playIcon, setPlayIcon] = useState(<IconPlayerPlay />);
  const hideTimeoutRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Control visibility based on mouse movement
  const handleMouseMovement = () => {
    setControlsVisible(true); // Show controls when mouse moves
    clearTimeout(hideTimeoutRef.current); // Clear existing timeout
    hideTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false); // Hide controls after 3 seconds of inactivity
    }, 3000);
  };

  // Event listener for mouse movement
  useEffect(() => {
    const videoWrapper = videoRef.current.parentNode;
    videoWrapper.addEventListener("mousemove", handleMouseMovement);

    return () => {
      videoWrapper.removeEventListener("mousemove", handleMouseMovement);
      clearTimeout(hideTimeoutRef.current); // Clean up timeout on unmount
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100; // Adjust volume as a fraction of 100
    }
  }, [volume]);

  const toggleMute = () => {
    if (videoRef.current) {
      setIsMuted(!isMuted);
      videoRef.current.muted = !isMuted;
    }
  };

  const handleVolumeChange = (event) => {
    setVolume(event.target.value);
    setShowVolumeSlider(true); // Keep slider visible while adjusting
  };

  useEffect(() => {
    // This checks if the currentVideoSelected is a File object before creating an object URL
    if (currentVideoSelected && currentVideoSelected instanceof File) {
      const videoUrl = URL.createObjectURL(currentVideoSelected);
      videoRef.current.src = videoUrl;

      // Cleanup function to revoke the URL when the video changes or component unmounts
      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [currentVideoSelected]);

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
      setPlayIcon(<IconPlayerPause />);
    } else if (videoRef.current) {
      videoRef.current.pause();
      setPlayIcon(<IconPlayerPlay />);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (currentVideoSelected) {
      videoRef.current.load();
      setIsPlaying(false); // Reset play state
      setCurrentTime(0); // Reset current time
      setDuration(videoRef.current.duration || 0);
    }
  }, [currentVideoSelected]);

  const toggleFullscreen = () => {
    const container = videoRef.current.parentNode; // Assuming the parent is the desired fullscreen container
    if (!document.fullscreenElement) {
      setFullscreenOpen(true);
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.mozRequestFullScreen) {
        // Firefox
        container.mozRequestFullScreen();
      } else if (container.webkitRequestFullscreen) {
        // Chrome, Safari & Opera
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) {
        // IE/Edge
        container.msRequestFullscreen();
      }
    } else {
      setFullscreenOpen(false);
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }
    }
  };

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

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      setCurrentVideoSelected(files[0]); // Ensure you're setting a File object
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    video.currentTime = (event.target.value / 100) * duration;
  };

  const handleSpeedChange = (currentSpeed) => {
    if (currentSpeed) {
      videoRef.current.playbackRate = parseFloat(currentSpeed);
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      handleSpeedChange(currentSpeed);
      setOpenSpeedOption(false);
    }
  }, [currentSpeed]);

  useEffect(() => {
    if (isPlaying) {
      console.log("Playing");
      setPlayIcon(<IconPlayerPause />);
    } else {
      console.log("Not Playing");
      setPlayIcon(<IconPlayerPlay />);
    }
  }, [isPlaying]);

  return (
    <div className="video-wrapper">
      {currentVideoSelected && (
        <>
          <video
            className="video"
            ref={videoRef}
            src={currentVideoSelected}
            controls={false}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
          />

          <>
            <div
              className={`play-button ${
                !controlsVisible ? "hide-buttons" : ""
              }`}
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
            <div
              className={`left-buttons ${
                !controlsVisible ? "hide-buttons" : ""
              }`}
            >
              <span>
                {formatTime(currentTime.toFixed(0))} /{" "}
                {formatTime(duration.toFixed(0))}
              </span>
              <div
                className="volume"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <IconVolume
                  onClick={() => setShowVolumeSlider(!showVolumeSlider)}
                  color={isMuted ? "gray" : "white"}
                />
                {showVolumeSlider && (
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
          </>
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
