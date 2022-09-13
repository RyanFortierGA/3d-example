import React, { useEffect, useState, Suspense }  from "react";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Canvas, useThree  } from "@react-three/fiber";
import { softShadows } from "@react-three/drei"
import '../assets/BuildingSpinner.scss';
import { Model } from '../assets/models/Stadium-2.js'
import { Model3 } from '../assets/models/Stadium-3.js'

softShadows()

export default function BuildingSpinner() {
//setting up states
const [currentModel, setCurrentModel] = useState('Panorama')
const [lightIntensity, setLightIntensity] = useState('normal')
const [loaded, setLoaded] = useState(false)
const [lightAngleX, setLightAngleX] = useState(0)
const [lightAngleY, setLightAngleY] = useState(10)
const [lightAngleZ, setLightAngleZ] = useState(10)
const [background, setBackground] = useState('transparent')
const [customOpen, setCustomOpen] = useState(false)
const [spotLight, setSpotLight] = useState(false)

const CameraController = () => {
    const { camera, gl } = useThree();
    useEffect(
        () => {

        //set camera angle on first load
        if(!loaded){
            camera.position.set( 17.7, 3, 1 );
            setLoaded(true)
        }

        const controls = new OrbitControls(camera, gl.domElement);
          controls.minDistance = 14;
          controls.maxDistance = 22;
          controls.enableZoom = true;
          controls.screenSpacePanning = true;
          controls.minPolarAngle = 1.4; 
          controls.maxPolarAngle = 1.4; 
          controls.rotateSpeed = .7;
        },
        [camera, gl]
    );
    return null;
  };

  const xChange = (event) => {
    setLightAngleX(event.target.value);
  }
  const yChange = (event) => {
    setLightAngleY(event.target.value);
  }
  const zChange = (event) => {
    setLightAngleZ(event.target.value);
  }
  const bChange = (event) => {
    const background = document.getElementById('mArea')
    background.style.background = (event.target.value)
    setBackground(event.target.value)
  }
  const mChange = (event) => {
    setCurrentModel(event.target.innerHTML)
  }
  const iChange = (event) => {
    setLightIntensity(event.target.value)
  }

  return (
    <div className="buildingSpinner">
        <div className="spinnerTop">
            <div className="structureSelect">
                <h3>Structures</h3>
                <div className="structSelectors" onClick={mChange}>
                    <span>Panorama</span>
                    <span>Chalet</span>
                    <span>Delta Vista</span>
                    <span>Premier</span>
                    <span>Anova Vista</span>
                </div>
            </div>
        <button className={customOpen ? 'customizeButton active-button' : 'customizeButton'} onClick={() => { setCustomOpen(!customOpen) }}>{customOpen ? 'customizing' : 'customize?'}</button>
        </div>
      <div className="mainArea" id="mArea">
        <div className={'container'}>
            <Canvas shadows camera={{ position: [-5, 2, 10], fov: 60 }} >
                <CameraController/>
                <fog attach="fog" args={["lightgray", 0, 40]} />
                <ambientLight intensity={3.4} />
                {lightIntensity === 'soft' && <directionalLight
                castShadow
                position={[lightAngleX, lightAngleY, lightAngleZ]}
                intensity={10}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={75}
                shadow-camera-left={-75}
                shadow-camera-right={75}
                shadow-camera-top={75}
                shadow-camera-bottom={ -75}
                /> }
                {lightIntensity === 'normal' && <directionalLight
                castShadow
                position={[lightAngleX, lightAngleY, lightAngleZ]}
                intensity={10}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={40}
                shadow-camera-left={-40}
                shadow-camera-right={40}
                shadow-camera-top={40}
                shadow-camera-bottom={-40}
                /> }
                {lightIntensity === 'hard' && <directionalLight
                castShadow
                position={[lightAngleX, lightAngleY, lightAngleZ]}
                intensity={10}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-camera-far={25}
                shadow-camera-left={-25}
                shadow-camera-right={25}
                shadow-camera-top={25}
                shadow-camera-bottom={ -25}
                /> }
                {spotLight && <pointLight position={[0, 10, 0]} intensity={0.2} power={.2} color="white" decay={4} castShadow/>}

                <group position={[0, -3.5, 0]}>
                    <Suspense fallback={null}>
                        {currentModel === 'Panorama' && <Model/>}
                        {currentModel === 'Chalet' && <Model3/>}
                    </Suspense>
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 2, 0]} receiveShadow >
                        <planeBufferGeometry attach="geometry" args={[100, 100]} />
                        <shadowMaterial attach="material" transparent opacity={0.4} needsUpdate={true}  />
                    </mesh>
                </group>
            </Canvas>
        </div>
      </div>
      <div className="spinnerBottom">
            <div className="spinnerBottom_left">
                <span className={customOpen ? 'customizing' : ''} onClick={() => { setCustomOpen(!customOpen) }}>Customize</span>
                {customOpen && <div className="customize-wrapper">
                    <div className="custom-picker">
                        <h3>Lighting- X Angle:</h3>
                        <input type="range" min="-100" max="100" value={lightAngleX} onChange={xChange}/>
                    </div>
                    <div className="custom-picker">
                        <h3>Lighting- Y Angle:</h3>
                        <input type="range" min="-100" max="100" value={lightAngleY} onChange={yChange}/>
                    </div>
                    <div className="custom-picker">
                        <h3>Lighting- Z Angle:</h3>
                        <input type="range" min="-100" max="100" value={lightAngleZ} onChange={zChange}/>
                    </div>
                    <div className="custom-picker">
                        <h3>Lighting intensity:</h3>
                        <select id="intensity" onChange={iChange} value={lightIntensity}>
                            <option value="soft">Soft Lighting</option>
                            <option value="normal">Normal Lighting</option>
                            <option value="hard">Hard Lighting</option>
                            <option value="off">No Lighting</option>

                        </select>
                    </div>
                      <div className="custom-picker">
                        <h3>Shine Spotlight:</h3>
                        <input type="checkbox" id="spotLight" name="spotLight" onClick={() => { setSpotLight(!spotLight) }}/>
                    </div>
                    <div className="custom-picker">
                        <h3>Background:</h3>
                        <select id="lang" onChange={bChange} value={background}>
                            <option value="transparent">Default</option>
                            <option value="linear-gradient( #00d2ff, #3a7bd5)">Day</option>
                            <option value="linear-gradient(#EEBAA5, #DE7D8E 70%)">Sunset</option>
                            <option value="linear-gradient( #e6dada, #274046)">Night</option>
                        </select>
                    </div>
                </div>}
                <span>Materials</span>
                <span>lorem ipsum</span>
                <span>doler set</span>
                <span>amet consectur</span>
            </div>   
            <div className="spinnerBottom_right">
                <p>
                    <span>{currentModel}</span> is characterized by the round shape and horizontal glass panels to provide an optimal view of your event  from within the structure
                </p>
            </div> 
        </div>    
    </div>    
  );
}
