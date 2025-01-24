"use client";

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const ThreeScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      // Update the container size initially
      setContainerSize({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        containerSize.width / containerSize.height,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
      });
      renderer.setSize(containerSize.width, containerSize.height);
      containerRef.current.appendChild(renderer.domElement);

      //   renderer.setClearColor(0x000000, 1);  // Black background
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 5.5;

      camera.position.x = 70; // Move the camera to the left of the model
      camera.position.y = 2; // Adjust the vertical position if needed
      camera.position.z = 5; // Keep the same distance
      camera.lookAt(new THREE.Vector3(0, 1, 0)); // Look at the center of the model

      //   const light = new THREE.DirectionalLight(0xffffff, 1);
      //   light.position.set(5, 5, 5).normalize();
      //   scene.add(light);

      // Add Ambient Light for global lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
      scene.add(ambientLight);

      // Add multiple Directional Lights to simulate sunlight from all directions
      const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight1.position.set(1, 1, 1).normalize();
      scene.add(directionalLight1);

      const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight2.position.set(-1, 1, -1).normalize();
      scene.add(directionalLight2);

      //   const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.5);
      //   directionalLight3.position.set(1, -1, -1).normalize();
      //   scene.add(directionalLight3);

      //   const directionalLight4 = new THREE.DirectionalLight(0xffffff, 0.5);
      //   directionalLight4.position.set(-1, -1, 1).normalize();
      //   scene.add(directionalLight4);

      let controls = new OrbitControls(camera, renderer.domElement);

      // Dynamically import GLTFLoader and OrbitControls
      import("three/addons/loaders/GLTFLoader.js").then((module) => {
        const loader = new module.GLTFLoader();

        let mixer: THREE.AnimationMixer | undefined;

        loader.load(
          "/models/porsche_911_gt3 (1).glb", // Path to your model file
          (gltf) => {
            const model = gltf.scene;
            scene.add(model);

            // Initialize AnimationMixer and play animations
            mixer = new THREE.AnimationMixer(model);
            gltf.animations.forEach((clip) => {
              mixer?.clipAction(clip).play();
            });

            // Dynamically import OrbitControls after model is loaded
            import("three/addons/controls/OrbitControls.js").then(
              (controlsModule) => {
                controls = new controlsModule.OrbitControls(
                  camera,
                  renderer.domElement
                );

                controls.enableZoom = true;
                controls.zoomSpeed = 1.5;
                controls.enableRotate = true;
                controls.rotateSpeed = 2.0;
                controls.enablePan = false;
                controls.panSpeed = 1.5;
                controls.screenSpacePanning = true;
                controls.maxPolarAngle = Math.PI / 2;
                controls.minDistance = 3;
                controls.maxDistance = 5;
                controls.enableDamping = true;
                controls.dampingFactor = 0.25;
                controls.target.set(0, 1, 0);
              }
            );

            // Scale the model to desired size
            model.scale.set(1, 1, 1); // Scaling the model uniformly (50% size)
            // Or scale non-uniformly:
            // model.scale.set(0.5, 1.5, 1);  // Scaling X by 50%, Y by 150%, and Z by 100%

            // Render loop for model
            const animate = () => {
              requestAnimationFrame(animate);

              // Update animation if mixer is available
              if (mixer) mixer.update(0.01);

              // Continuously rotate the model on the Y-axis
              //   if (model) {
              //     model.rotation.y += 0.01; // Rotate model 1 degree per frame
              //   }

              // Update controls if defined
              if (controls) controls.update(); // Only update if controls are defined

              renderer.render(scene, camera);
            };
            animate();
          },
          undefined,
          (error) => {
            console.error("An error occurred while loading the model", error);
          }
        );
      });

      const handleResize = () => {
        if (containerRef.current) {
          const width = containerRef.current.offsetWidth;
          const height = containerRef.current.offsetHeight;
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
          setContainerSize({ width, height });
        }
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [containerSize.width, containerSize.height]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center bg-[red]"
    />
  );
};

export default ThreeScene;
