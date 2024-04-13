import React, { useState, useRef, useEffect } from "react";
import "./VideoPlayer.css";
import { IconPlayerPlay, IconPlayerPause } from "@tabler/icons-react";
import VideoButtons from "../../utils/VideoPlayer/VideoButtons";

function VideoPlayer({
  currentTime,
  setCurrentTime,
  currentVideoSelected,
  setCurrentVideoSelected,
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
      videos[currentVideoSelected]?.file &&
      videos[currentVideoSelected]?.file instanceof File
    ) {
      const videoUrl = URL.createObjectURL(videos[currentVideoSelected]?.file);
      videoRef.current.src = videoUrl;

      return () => URL.revokeObjectURL(videoUrl);
    }
  }, [currentVideoSelected]);

  useEffect(() => {
    if (videos[currentVideoSelected]?.file) {
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

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleVideoEnd = () => {
      if (currentVideoSelected < videos.length - 1) {
        setCurrentVideoSelected(currentVideoSelected + 1);
      } else {
        // Optional: handle the case when it's the last video
        // For example, restart from the first video or stop playback
        console.log("Reached the end of the playlist");
      }
    };

    video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("ended", handleVideoEnd);
    };
  }, [currentVideoSelected, videos.length, setCurrentVideoSelected]);

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
      {videos[currentVideoSelected]?.file && (
        <>
          <video
            className="video"
            ref={videoRef}
            src={videos[currentVideoSelected]?.file}
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
