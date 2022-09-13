
import React, { useEffect } from "react";
import { Canvas, useThree  } from "@react-three/fiber";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import '../assets/EnviornmentSpinner.scss';
import * as THREE from 'three';

export default function EnviornmentSpinner() {
  const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
        () => {
          camera.position.set( 30, 8, 1 );

          const controls = new OrbitControls(camera, gl.domElement);
          controls.minDistance = 20;
          controls.maxDistance = 40;

          controls.enableZoom = true;
          controls.screenSpacePanning = true;
          controls.minPolarAngle = 1.3; 
          controls.maxPolarAngle = 1.3; 
          return () => {
            controls.dispose();
          };
        },
        [camera, gl]
    );
    return null;
  };
  const Cube = () => {
  return (
    <mesh rotation={[0, 0, 0]} 
    castShadow receiveShadow
    >
      <boxGeometry attach="geometry" args={[8,8,8]} />
      <meshStandardMaterial
        attach="material"
        color="pink"
      />
    </mesh>
    );
  }
  const Plane = () => (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#d1cebd" />
    </mesh>
  );

  return (
    <div className="enviornmentSpinner">
    <Canvas shadows>
      <CameraController />
      <directionalLight
        intensity={0.5}
        castShadow
        shadow-mapSize-height={10}
        shadow-mapSize-width={10}
      />      
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 5, 5]} angle={0.9} />
      <Cube castShadow />
      <Plane/>
    </Canvas>
    </div>
  );
};