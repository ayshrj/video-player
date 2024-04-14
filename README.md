# Video Player Readme

**Notes:**
- This video player uses video files stored on your local PC and does not stream videos from online sources.
- Only the CSS for the Input design was copied from [SitePoint](https://www.sitepoint.com/css-custom-range-slider/). Other than that, all CSS was custom-made.
- The code is heavily commented for ease of understanding. Feel free to check the comments for more insights into the implementation.

## Library Used
- **react-dnd**:
  - Size: 6.9k (gzipped: 2.7k)
- **@tabler/icons-react**

## App Link
[Video Player App](https://video-player-murex-tau.vercel.app/)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-repo/video-player.git
   ```
2. Navigate to the project directory:
   ```
   cd video-player
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the App
Once you have installed the dependencies, you can run the app using:

```
npm run dev
```

This command will start the development server and open the app in your default web browser.

## Features
### 1. App Feature
- Application responsive for various screen sizes.
- Keyboard shortcuts for ease of use.
   - 'Space' to Pause/Play
   - 'Arrow Right' to forward 10 sec
   - 'Arrow Left' to rewind 10 sec
   - 'P' for Picture in Picture
   - '-' for Speed Decrease
   - '+' for Speed Increase

### 2. Video Player Component
- Play/Pause toggle.
- Seek functionality.
- Timer displaying current playback time and duration.
- Autoplay.
- Speed selector for playback speed adjustment.
- Rewind 10 seconds and forward 10 seconds.
- Picture in Picture.
- Additional Features:
  - Fullscreen mode.
  - Volume control.
  - Thumbnail previews.
  - Keyboard shortcuts.

### 3. Playlist Component
- Playlist component to display and manage videos.
- Allows users to reorder videos in the playlist.
- Clicking on a video in the playlist loads and plays that video in the video player.
- Continue playing from where users left off.

**Notes:**
- This video player uses video files stored on your local PC and does not stream videos from online sources.
- Only the CSS for the Input design was copied from [SitePoint](https://www.sitepoint.com/css-custom-range-slider/). Other than that, all CSS was custom-made.
- The code is heavily commented for ease of understanding. Feel free to check the comments for more insights into the implementation.Sure, here's the updated readme with the installation process and how to run the app:

---

# Video Player Readme

## Library Used
- **react-dnd**:
  - Size: 6.9k (gzipped: 2.7k)
- **@tabler/icons-react**

## App Link
[Video Player App](https://video-player-murex-tau.vercel.app/)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-repo/video-player.git
   ```
2. Navigate to the project directory:
   ```
   cd video-player
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Running the App
Once you have installed the dependencies, you can run the app using:

```
npm start
```

This command will start the development server and open the app in your default web browser.

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
- Rewind 10 seconds and forward 10 seconds.
- Picture in Picture.
- Additional Features:
  - Fullscreen mode.
  - Volume control.
  - Thumbnail previews.
  - Keyboard shortcuts.

### 3. Playlist Component
- Playlist component to display and manage videos.
- Allows users to reorder videos in the playlist.
- Clicking on a video in the playlist loads and plays that video in the video player.
- Continue playing from where users left off.