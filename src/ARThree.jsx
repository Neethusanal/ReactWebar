import React, { useEffect, useRef } from 'react';
import { MindARThree } from 'mind-ar/dist/mindar-image-three.prod.js';
import * as THREE from 'three';

export default () => {
  const containerRef = useRef(null);

  useEffect(() => {
    // Request camera access
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        console.log('Camera access granted.');
        
        const mindarThree = new MindARThree({
          container: containerRef.current,
          imageTargetSrc: "./assets/targets.mind",
        });

        const { renderer, scene, camera } = mindarThree;
        const anchor = mindarThree.addAnchor(0);

        // Create the video element
        const video = document.createElement('video');
        video.src = "./assets/video.mp4";
        video.loop = true;
        video.muted = true;
        video.autoplay = true;
        video.setAttribute('playsinline', '');
        video.play();

        // Create a video texture
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;

        // Create a plane and apply the video texture
        const geometry = new THREE.PlaneGeometry(1, 0.55);
        const material = new THREE.MeshBasicMaterial({
          map: videoTexture,
          side: THREE.DoubleSide,
        });
        const plane = new THREE.Mesh(geometry, material);
        anchor.group.add(plane);

        mindarThree.start();
        renderer.setAnimationLoop(() => {
          renderer.render(scene, camera);
        });

        // Cleanup
        return () => {
          if (mindarThree) {
            renderer.setAnimationLoop(null);
            mindarThree.stop();
          }
          if (video) {
            video.pause();
          }
        };
      })
      .catch((err) => {
        console.error('Error accessing camera: ', err);
        alert('Camera access is required for this feature. Please enable camera permissions.');
      });

  }, []);

  return <div style={{ width: "100%", height: "100%" }} ref={containerRef}></div>;
};
