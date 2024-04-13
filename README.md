# Video Player Readme

## Library Used
- **react-dnd**:
  - Size: 6.9k (gzipped: 2.7k)
- **@tabler/icons-react**

## App Link
[Video Player App](https://video-player-murex-tau.vercel.app/)

**Note:** 
- This video player uses video files stored on your local PC and does not stream videos from online sources.
- Only the CSS that I borrowed was for the input slider design which was taken from [SitePoint](https://www.sitepoint.com/css-custom-range-slider/). Other than that, all CSS was custom-made.
- The code is heavily commented for ease of understanding. Feel free to check the comments for more insights into the implementation.

## Features
### 1. App Feature
- Application responsive for various screen sizes.
- Keyboard shortcuts for ease of use.

### 2. Video Player Component
- Play/Pause toggle.
- Seek functionality.
- Timer displaying current playback time and duration.
- Autoplay.
- Speed selector for playback speed adjustment.
- Additional Features:
  - Rewind 10 seconds and forward 10 seconds.
  - Picture in Picture.
  - Fullscreen mode.
  - Volume control.
  - Thumbnail previews.
  - Keyboard shortcuts.

### 3. Playlist Component
- Playlist component to display and manage videos.
- Allows users to reorder videos in the playlist.
- Clicking on a video in the playlist loads and plays that video in the video player.
- Continue playing from where users left off.