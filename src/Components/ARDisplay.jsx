import React, { useEffect, useRef, useState } from 'react';
import 'aframe';
import 'mind-ar/dist/mindar-image-aframe.prod.js';

const ARDisplay = () => {
  const sceneRef = useRef(null);
  const videoRef = useRef(null);
  const [targetFound, setTargetFound] = useState(false);

  useEffect(() => {
    const sceneEl = sceneRef.current;
    if (!sceneEl) return;

    const arSystem = sceneEl.systems["mindar-image-system"];
    if (!arSystem) {
      console.warn("MindAR system is not available.");
      return;
    }

    // Start AR when the scene renders
    sceneEl.addEventListener('renderstart', () => {
      arSystem.start();
    });

    const targetElement = sceneEl.querySelector('[mindar-image-target]');

    // Handle target found event
    const handleTargetFound = () => {
      console.log("Target Found!");
      setTargetFound(true);
      if (videoRef.current && videoRef.current.readyState >= 3) { // Ensure the video is ready
        videoRef.current.play();
      }
    };

    // Attach event listener
    if (targetElement) {
      targetElement.addEventListener('targetFound', handleTargetFound);
    } else {
      console.warn("Target element not found.");
    }

    // Cleanup function
    return () => {
      // Pause the video and reset it
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }

      // Stop AR system
      if (arSystem) {
        arSystem.stop(); // Safely stop AR system
      }

      // Remove event listener for target found
      if (targetElement) {
        targetElement.removeEventListener('targetFound', handleTargetFound);
      }
    };
  }, []);

  return (
    <a-scene
      ref={sceneRef}
      mindar-image="imageTargetSrc: ./assets/target.mind; autoStart: true; uiScanning: no"
      embedded
      vr-mode-ui="enabled: false"
      device-orientation-permission-ui="enabled: false"
    >
      <a-assets>
        <video
          ref={videoRef}
          id="videoElement"
          src="./assets/video.mp4"
          preload="auto"
          loop
          muted
          playsInline
          onLoadedData={() => console.log("Video loaded")}
        ></video>
      </a-assets>

      <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

      <a-entity mindar-image-target="targetIndex: 0">
        {/* Play video when target is detected */}
        <a-video
          src="#videoElement"
          position="0 0 0"
          width="50"
          height="50"
          rotation="0 0 0"
        ></a-video>
      </a-entity>
    </a-scene>
  );
};

export default ARDisplay;
