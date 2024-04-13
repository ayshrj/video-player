import React, { useState, useRef, useEffect } from "react";
import "./VideoPlayer.css";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import VideoButtons from "../../utils/VideoPlayer/VideoButtons";

function VideoPlayer({
  currentTime,
  setCurrentTime,
  currentVideoSelected,
  videos,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState("1.0");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const videoRef = useRef(null);
  const [playIcon, setPlayIcon] = useState(<IconPlayerPlay />);
  const hideTimeoutRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [openSpeedOption, setOpenSpeedOption] = useState(false);

  const handleMouseMovement = () => {
    setControlsVisible(true);
    clearTimeout(hideTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

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

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (
      currentVideoSelected?.file &&
      currentVideoSelected?.file instanceof File
    ) {
      const videoUrl = URL.createObjectURL(currentVideoSelected?.file);
      videoRef.current.src = videoUrl;

      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [currentVideoSelected]);

  useEffect(() => {
    if (currentVideoSelected?.file) {
      videoRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(videoRef.current.duration || 0);
    }
  }, [currentVideoSelected]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100; // Adjust volume as a fraction of 100
    }
  }, [volume]);

  // const handleFileChange = (event) => {
  //   const files = event.target.files;
  //   if (files.length > 0) {
  //     setCurrentVideoSelected(files[0]);
  //   }
  // };

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
    if (currentVideoSelected?.lastTime) {
      videoRef.current.currentTime = currentVideoSelected.lastTime;
    }
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
      setPlayIcon(<IconPlayerPause />);
    } else {
      setPlayIcon(<IconPlayerPlay />);
    }
  }, [isPlaying]);

  return (
    <div className="video-wrapper">
      {currentVideoSelected?.file && (
        <>
          <video
            className="video"
            ref={videoRef}
            src={currentVideoSelected?.file}
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
            isMuted={fullscreenOpen}
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
          />
        </>
      )}
    </div>
  );
}

export default VideoPlayer;
