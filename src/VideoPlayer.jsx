import React, { useState, useRef, useEffect } from "react";
import "./VideoPlayer.css";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconChevronUp,
  IconChevronDown,
  IconMaximize,
  IconMinimize,
} from "@tabler/icons-react";

function VideoPlayer({ currentVideoSelected, setCurrentVideoSelected }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState("1.0");
  const [openSpeedOption, setOpenSpeedOption] = useState(false);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const videoRef = useRef(null);
  const [playIcon, setPlayIcon] = useState(<IconPlayerPlay />);

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
    <div>
      <input type="file" accept="video/*" onChange={handleFileChange} />
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
            />

            <div className="play-button" onClick={togglePlay}>
              {playIcon}
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={(currentTime / duration) * 100 || 0}
              onChange={handleSeek}
              className="seek-button"
            />
            <span className="timer">
              {formatTime(currentTime.toFixed(0))} /{" "}
              {formatTime(duration.toFixed(0))}
            </span>
            <div className="fullscreen" onClick={toggleFullscreen}>
              {!fullscreenOpen ? (
                <IconMaximize color="white" />
              ) : (
                <IconMinimize color="white" />
              )}
            </div>
            <div className="speed">
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

            {/* <select
              className="speed"
              onChange={handleSpeedChange}
              defaultValue="1.0"
            >
              <option className="speed-option" value="0.5">
                0.5x
              </option>
              <option className="speed-option" value="1.0">
                1x
              </option>
              <option className="speed-option" value="1.5">
                1.5x
              </option>
              <option className="speed-option" value="2.0">
                2x
              </option>
            </select> */}
          </>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default VideoPlayer;
