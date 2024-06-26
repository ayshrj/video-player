import React, { useState, useRef, useEffect } from "react";
import "./VideoPlayer.css";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import VideoButtons from "../../utils/VideoPlayer/VideoButtons";
import appIcon from "../../assets/defaultIcon.png";

function VideoPlayer({
  currentTime,
  setCurrentTime,
  currentVideoSelected,
  setCurrentVideoSelected,
  videos,
  updateVideo,
}) {
  // State to manage video play/pause status
  const [isPlaying, setIsPlaying] = useState(false);
  // State for video duration
  const [duration, setDuration] = useState(0);
  // State to manage playback speed
  const [currentSpeed, setCurrentSpeed] = useState("1.0");
  // State to manage fullscreen toggle
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  // State for managing volume level
  const [volume, setVolume] = useState(100);
  // State for the dynamic change of play/pause icon
  const [playIcon, setPlayIcon] = useState(<IconPlayerPlay />);
  // Reference to timeout for hiding controls
  const hideTimeoutRef = useRef(null);
  // State to show/hide the video controls
  const [controlsVisible, setControlsVisible] = useState(true);
  // State to manage the visibility of speed options
  const [openSpeedOption, setOpenSpeedOption] = useState(false);
  // State to manage mute toggle
  const [isMuted, setIsMuted] = useState(false);
  // State to hold the currently playing video file
  const [videoFile, setVideoFile] = useState(null);

  const videoRef = useRef(null);

  // Function to handle mouse movement to show/hide controls
  const handleMouseMovement = () => {
    setControlsVisible(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  // Add event listeners to video wrapper for mouse movement
  useEffect(() => {
    const videoWrapper = videoRef.current?.parentNode;
    if (videoWrapper) {
      videoWrapper.addEventListener("mousemove", handleMouseMovement);

      return () => {
        videoWrapper.removeEventListener("mousemove", handleMouseMovement);
        clearTimeout(hideTimeoutRef.current);
      };
    }
  }, []);

  // Adjust video volume based on the state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Load new video file based on the current selection
  useEffect(() => {
    if (currentVideoSelected !== -1 && videos[currentVideoSelected]?.file) {
      setVideoFile(videos[currentVideoSelected].file); // Update video file object
    } else if (currentVideoSelected === -1) {
      setVideoFile(null);
    }
  }, [currentVideoSelected, videos]);

  // Setup video source and handle cleanup
  useEffect(() => {
    if (videoFile) {
      const videoUrl = URL.createObjectURL(videoFile);
      videoRef.current.src = videoUrl;

      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [videoFile]);

  // Toggle play or pause status
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

  // Set video duration and seek to last known time
  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
    if (videos[currentVideoSelected]?.lastTime) {
      videoRef.current.currentTime = videos[currentVideoSelected].lastTime;
    }
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

  // Update currentTime for video
  const handleTimeUpdate = () => {
    setCurrentTime(videoRef.current.currentTime);
  };

  // Seek to a new time in the video
  const handleSeek = (event) => {
    const video = videoRef.current;
    video.currentTime = (event.target.value / 100) * duration;
  };

  // Handle changes in playback speed
  const handleSpeedChange = (currentSpeed) => {
    if (currentSpeed) {
      videoRef.current.playbackRate = parseFloat(currentSpeed);
    }
  };

  // Apply playback rate change
  useEffect(() => {
    if (videoRef.current) {
      handleSpeedChange(currentSpeed);
      setOpenSpeedOption(false);
    }
  }, [currentSpeed]);

  // Update the play/pause icon based on isPlaying state
  useEffect(() => {
    if (isPlaying) {
      setPlayIcon(<IconPlayerPause />);
    } else {
      setPlayIcon(<IconPlayerPlay />);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoFile) {
      // Define the function to handle the key press event
      let newVolume;
      const handleKeyPress = (event) => {
        switch (event.key) {
          case " ":
            togglePlay();
            break;
          case "+":
            if (currentSpeed === "0.5") {
              setCurrentSpeed("1.0");
              handleSpeedChange("1.0");
            } else if (currentSpeed === "1.0") {
              setCurrentSpeed("1.5");
              handleSpeedChange("1.5");
            } else if (currentSpeed === "1.5") {
              setCurrentSpeed("2.0");
              handleSpeedChange("2.0");
            }
            break;
          case "-":
            if (currentSpeed === "2.0") {
              setCurrentSpeed("1.5");
              handleSpeedChange("1.5");
            } else if (currentSpeed === "1.5") {
              setCurrentSpeed("1.0");
              handleSpeedChange("1.0");
            } else if (currentSpeed === "1.0") {
              setCurrentSpeed("0.5");
              handleSpeedChange("0.5");
            }
            break;
          case "ArrowUp":
            newVolume = Math.min(100, volume + 10);
            setVolume(newVolume);
            break;
          case "ArrowDown":
            newVolume = Math.max(0, volume - 10);
            setVolume(newVolume);
            break;
          case "ArrowLeft":
            handleRewind();
            break;
          case "ArrowRight":
            handleForward();
            break;
          case "p" || "P":
            togglePictureInPicture();
            break;
          default:
            // Handle other keys or do nothing
            break;
        }
      };

      // Add event listener for the 'keydown' event
      window.addEventListener("keydown", handleKeyPress);

      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener("keydown", handleKeyPress);
      };
    }
  }, []);

  return (
    <div className="video-wrapper">
      {videoFile ? (
        <>
          <video
            className="video"
            ref={videoRef}
            controls={false}
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onClick={togglePlay}
            onPlay={() => {
              setPlayIcon(<IconPlayerPause />);
            }}
            onPause={() => {
              setPlayIcon(<IconPlayerPlay />);
            }}
            autoPlay={true}
          />

          <VideoButtons
            controlsVisible={controlsVisible}
            playIcon={playIcon}
            currentTime={currentTime}
            duration={duration}
            volume={volume}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            fullscreenOpen={fullscreenOpen}
            currentSpeed={currentSpeed}
            togglePlay={togglePlay}
            handleSeek={handleSeek}
            setVolume={setVolume}
            setCurrentSpeed={setCurrentSpeed}
            setFullscreenOpen={setFullscreenOpen}
            videoRef={videoRef}
            openSpeedOption={openSpeedOption}
            setOpenSpeedOption={setOpenSpeedOption}
            handleRewind={handleRewind}
            handleForward={handleForward}
            togglePictureInPicture={togglePictureInPicture}
          />
        </>
      ) : (
        <img src={appIcon} className="default-icon" />
      )}
    </div>
  );
}

export default VideoPlayer;
