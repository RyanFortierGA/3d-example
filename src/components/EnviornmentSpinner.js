import React, { useEffect  }  from "react";
import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GroundProjectedEnv } from 'three/addons/objects/GroundProjectedEnv.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import building1 from '../assets/models/building1.glb'
import field from '../assets/backgrounds/field_bg.hdr'
import city from '../assets/backgrounds/city_bg.hdr'
// import grasslands from '../assets/backgrounds/grasslands_bg.hdr'
import snow from '../assets/backgrounds/snow_bg.hdr'
import shadowMap from '../assets/images/shadow2.png'
import '../assets/EnviornmentSpinner.scss';
import DotLoader from "react-spinners/DotLoader";

export default function EnviornmentSpinner() {
    const params = {
        height: 20,
        radius: 440,
        backdrop: 1,
        circleColor: 0x0000ff,
        circleMetalness: 1,
        circleClearcoat: 1,
        circleRoughness: 0.8,
        dodecColor: 0x000000,
        dodecMetalness: 1,
        dodecClearcoat: 1,
        dodecRoughness: 0.8,
        cubeColor: 0x00ff00,
        cubeMetalness: 1,
        cubeClearcoat: 1,
        cubeRoughness: 0.8,
    };
    let camera, scene, renderer, env;

    const initialize = async () => {

       camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
       camera.position.set(-20, 7, 20);
       camera.lookAt(0, 4, 0);

       scene = new THREE.Scene();

       const hdrLoader = new RGBELoader();
       
       const envMap1 = await hdrLoader.loadAsync(field);

       envMap1.mapping = THREE.EquirectangularReflectionMapping;
       env = new GroundProjectedEnv(envMap1);
       env.scale.setScalar(100);
       scene.add(env);
       
       scene.background = envMap1;
       scene.environment = envMap1;


       const dracoLoader = new DRACOLoader();
       dracoLoader.setDecoderPath('js/libs/draco/gltf/');

       const loader = new GLTFLoader();
       loader.setDRACOLoader(dracoLoader);

       const shadow = new THREE.TextureLoader().load(shadowMap);

       loader.load(building1, function(gltf) {

       const buildingMaterial = new THREE.MeshPhysicalMaterial({
           color: 0x000000,
           metalness: 1.0,
           roughness: 0.8,
           clearcoat: 1.0,
           clearcoatRoughness: 0.2
       });

        const building2Material = new THREE.MeshPhysicalMaterial({
           color: 0x00ff00,
           metalness: 1.0,
           roughness: 0.8,
           clearcoat: 1.0,
           clearcoatRoughness: 0.2
       });

        const building3Material = new THREE.MeshPhysicalMaterial({
           color: 0x0000ff,
           metalness: 0.0,
           roughness: 0.8,
           clearcoat: 1.0,
           clearcoatRoughness: 0.2
       });

       const buildingModel = gltf.scene.children[0];
       buildingModel.scale.multiplyScalar(1);
       
       buildingModel.getObjectByName('861d4365133d473cb6019855f1c34b03fbx').material = buildingMaterial;

        //    shadow
       const mesh = new THREE.Mesh(
           new THREE.PlaneGeometry( 20, 20, 32, 32 ),
           new THREE.MeshBasicMaterial({
               toneMapped: false, map: shadow, transparent: true
           })
       );
       const mesh2 = new THREE.Mesh(
           new THREE.PlaneGeometry( 10, 10, 16, 16 ),
           new THREE.MeshBasicMaterial({
               toneMapped: false, map: shadow, transparent: true
           })
       );
       const mesh3 = new THREE.Mesh(
           new THREE.CircleGeometry( 5, 32 ),
           new THREE.MeshBasicMaterial({
               toneMapped: true, map: shadow, transparent: true
           })
       );
       const building_1 = new THREE.Mesh(
           new THREE.DodecahedronGeometry( 10, 0 ),
           buildingMaterial
       );

       const building_2 = new THREE.Mesh(
           new THREE.BoxGeometry( 5, 5, 5 ),
           building2Material
       );
       const building_3 = new THREE.Mesh(
           new THREE.SphereGeometry( 7.5, 16, 8 ),
           building3Material
       );

       building_1.position.set(0,8,0)    
       building_1.rotation.set(10,0,0) 
       building_1.castShadow = true  

       scene.add(building_1);

       mesh.rotation.set(1, 6.3, 10) 
       mesh.position.set(0.38, 10, 1) 
       mesh.renderOrder = 2;
       building_1.add(mesh);

       building_2.position.set(-20, 2, -20) 
       scene.add(building_2);
       mesh2.rotation.set(4.7, 6.3, 9.4) 
       mesh2.position.set(-1.64, -2.6, -3) 
       mesh2.renderOrder = 2;
       building_2.add(mesh2);
       
       building_3.position.set(20, 7, 20) 
       scene.add(building_3);
       mesh3.rotation.set(4.7, 6.3, 9.4) 
       mesh3.position.set(-1.64, -7.04, -1.64) 
       mesh3.renderOrder = 2;
       building_3.add(mesh3);

       // scene.add(buildingModel);

       //create Gui
       const gui = new GUI();
       const circleFolder = gui.addFolder('Circle Materials')
       const dodecFolder = gui.addFolder('Circle Materials')
       const cubeFolder = gui.addFolder('Circle Materials')

       //circle
       circleFolder.addColor( params, 'circleColor' ).onChange( function() { building_3.material.color.set( params.circleColor ); } );
       circleFolder.add( params, 'circleMetalness', -20, 20).onChange( function() { building_3.material.metalness = params.circleMetalness } );
       circleFolder.add( params, 'circleRoughness', -20, 20).onChange( function() { building_3.material.roughness = params.circleRoughness } );
       circleFolder.add( params, 'circleClearcoat', -20, 20).onChange( function() { building_3.material.clearcoat = params.circleClearcoat } );

       //dodec
       dodecFolder.addColor( params, 'dodecColor' ).onChange( function() { building_1.material.color.set( params.dodecColor ); } );
       dodecFolder.add( params, 'dodecMetalness', -20, 20).onChange( function() { building_1.material.metalness = params.dodecMetalness } );
       dodecFolder.add( params, 'dodecRoughness', -20, 20).onChange( function() { building_1.material.roughness = params.dodecRoughness } );
       dodecFolder.add( params, 'dodecClearcoat', -20, 20).onChange( function() { building_1.material.clearcoat = params.dodecClearcoat } );
        //cube
       cubeFolder.addColor( params, 'cubeColor' ).onChange( function() { building_2.material.color.set( params.cubeColor ); } );
       cubeFolder.add( params, 'cubeMetalness', -20, 20).onChange( function() { building_2.material.metalness = params.cubeMetalness } );
       cubeFolder.add( params, 'cubeRoughness', -20, 20).onChange( function() { building_2.material.roughness = params.cubeRoughness } );
       cubeFolder.add( params, 'cubeClearcoat', -20, 20).onChange( function() { building_2.material.clearcoat = params.cubeClearcoat } );

       //map render
       gui.add(params, 'backdrop', 1,3,1).onChange(async function() {
        let environment = null
        let environmentMap = null
        load()
        if(params.backdrop === 1){
            environmentMap = envMap1;
        } 
        else if(params.backdrop === 2) {
            environmentMap = await hdrLoader.loadAsync(city);
        }
        else{ 
            environmentMap = await hdrLoader.loadAsync(snow);
        }
        environmentMap.mapping = THREE.EquirectangularReflectionMapping;
        environment = new GroundProjectedEnv(environmentMap);
        environment.scale.setScalar(100);
        scene.add(environment);
        scene.background = environmentMap;
        scene.environment = environmentMap;
        document.elementFromPoint(400, 400).click();
        setTimeout(() => {
            render()
        }, 100);
       } );

       render(false);
       });

       renderer = new THREE.WebGLRenderer({ antialias: true });
       renderer.setPixelRatio(window.devicePixelRatio);
       renderer.setSize(window.innerWidth, window.innerHeight);
       renderer.outputEncoding = THREE.sRGBEncoding;
       renderer.toneMapping = THREE.ACESFilmicToneMapping;
       renderer.domElement.id = 'envSpinner';

       const controls = new OrbitControls(camera, renderer.domElement);
       controls.addEventListener('change', render);
       controls.target.set(0, 2, 0);
       controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
       controls.maxDistance = 80;
       controls.minDistance = 20;
       controls.enablePan = false;
       controls.update();

       document.body.appendChild(renderer.domElement);
       window.addEventListener('resize', onWindowResize);
    }
    useEffect(() => {
        initialize().then( render )
    });
    const onWindowResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    const render = () => {
        renderer.render(scene, camera);
        env.radius = params.radius;
        env.height = params.height;
        const loader = document.getElementById('loader')
        loader.style.display= "none" 

    }
    const load = () => {
       const loader = document.getElementById('loader')
       loader.style.display="flex"
    //    setTimeout(() => {
    //       loader.style.display= "none" 
    //    }, 2500);
    }

    return (<>
        <div id="container">
        </div>
        <div className="loader" id="loader">
            <DotLoader color="#d5dcef" size={100} loading={true} />
        </div> 
        
   </>);
}
