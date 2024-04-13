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
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentSpeed, setCurrentSpeed] = useState("1.0");
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [volume, setVolume] = useState(100);
  const [playIcon, setPlayIcon] = useState(<IconPlayerPlay />);
  const hideTimeoutRef = useRef(null);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [openSpeedOption, setOpenSpeedOption] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoFile, setVideoFile] = useState(null); // State to store video file object

  const videoRef = useRef(null);

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
    if (currentVideoSelected !== -1 && videos[currentVideoSelected]?.file) {
      setVideoFile(videos[currentVideoSelected].file); // Update video file object
    } else if (currentVideoSelected === -1) {
      setVideoFile(null);
    }
  }, [currentVideoSelected, videos]);

  useEffect(() => {
    if (videoFile) {
      const videoUrl = URL.createObjectURL(videoFile);
      videoRef.current.src = videoUrl;

      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [videoFile]);

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
    if (videos[currentVideoSelected]?.lastTime) {
      videoRef.current.currentTime = videos[currentVideoSelected].lastTime;
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
          />
        </>
      ) : (
        <img src={appIcon} className="default-icon" />
      )}
    </div>
  );
}

export default VideoPlayer;
