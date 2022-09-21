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
import { softShadows } from "@react-three/drei"

softShadows()

export default function EnviornmentSpinner() {
    const params = {
        height: 20,
        radius: 440,
        backdrop: 1,
        cameraLocked: false,
        spotLight: false,
        dirLight:false,
        bakedShadows:false,
        circleColor: 0x363535,
        circleMetalness: 1,
        circleReflectiveness: 0,
        dodecColor: 0x0000ff,
        dodecMetalness: 0.8,
        dodecReflectiveness: 0.08,
        cubeColor: 0x00ff00,
        cubeMetalness: 0.5,
        cubeReflectiveness: 1,
    };
    const lightingParams = {
        dirLightX: 0,
        dirLightY: 10,
        dirLightZ: 10,
        dirIntensity: 1,
        spotLightX: 0,
        spotLightY: 10,
        spotLightZ: 10,
        spotIntensity: 1,
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

       const shadow = new THREE.TextureLoader().load(shadowMap);

       loader.load(building1, function(gltf) {

       const dodecMaterial = new THREE.MeshPhysicalMaterial({
           reflectivity:0.35,
           transmission:0,
           roughness:0.08,
           metalness:0.8,
           clearcoat:0.3,
           clearcoatRoughness:0.25,
           color:new THREE.Color(0x0000ff),
           ior:1.2,
           thickness:10.0,
       });

        const cubeMaterial = new THREE.MeshPhysicalMaterial({
           reflectivity:0.35,
           transmission:0,
           roughness:1,
           metalness:0.5,
           clearcoat:0.3,
           clearcoatRoughness:0.25,
           color:new THREE.Color(0x00ff00),
           ior:1.2,
           thickness:10.0,
       });

        const circleMaterial = new THREE.MeshPhysicalMaterial({
           reflectivity:0.35,
           transmission:0,
           roughness:0,
           metalness:1,
           clearcoat:0.3,
           clearcoatRoughness:0.25,
           color:new THREE.Color(0x363535),
           ior:1.2,
           thickness:10.0,
       });
       cubeMaterial.needsUpdate = true
       dodecMaterial.needsUpdate = true
       circleMaterial.needsUpdate = true
       const buildingModel = gltf.scene.children[0];
       buildingModel.scale.multiplyScalar(1);
       
       buildingModel.getObjectByName('861d4365133d473cb6019855f1c34b03fbx').material = dodecMaterial;

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
       
       const planeGeometry = new THREE.PlaneGeometry( 80, 80, 16, 16 );
       const planeMaterial = new THREE.ShadowMaterial()
       planeMaterial.needsUpdate = true
       planeMaterial.opacity = 0.5;
       const plane = new THREE.Mesh( planeGeometry, planeMaterial );

       const dodec = new THREE.Mesh(
           new THREE.DodecahedronGeometry( 10, 0 ),
           dodecMaterial
       );

       const cube = new THREE.Mesh(
           new THREE.BoxGeometry( 5, 5, 5 ),
           cubeMaterial
       );
       const circle = new THREE.Mesh(
           new THREE.SphereGeometry( 7.5, 16, 8 ),
           circleMaterial
       );
        
        //scene lighting
        const dirLight = new THREE.DirectionalLight( 0xffffff );
        dirLight.position.setY(26)
        dirLight.castShadow = true
        dirLight.intensity=100
        dirLight.shadow.mapSize.width = 512; // default
        dirLight.shadow.mapSize.height = 512; // default
        dirLight.shadow.camera.near = 0.5; // default
        dirLight.shadow.camera.far = 500; // default
        dirLight.name = "dirLight";
        const helper = new THREE.DirectionalLightHelper( dirLight, 5 );
        helper.name = "dirLightH";

        const spotLight = new THREE.PointLight( 0xFFFFFF, 1, 100 );
        spotLight.position.set(0, 30, 0) 
        spotLight.intensity=200 
        spotLight.power=200 
        spotLight.decay=4 
        spotLight.castShadow = true
        spotLight.name = "spotLight";

        const sphereSize = 1;
        const spotLightHelper = new THREE.PointLightHelper( spotLight, sphereSize );
        spotLightHelper.name = "spotLightH";

        //Add objects to scene
        dodec.position.set(0,7,0)    
        dodec.rotation.set(10,0,0) 
        dodec.castShadow = true  
        dodec.name = "dodec"

        scene.add(dodec);
        
        plane.receiveShadow = true
        plane.rotation.set(4.7, 6.28, 9.4) 
        plane.position.set(0, -1, 0) 
        scene.add(plane)  
        mesh.rotation.set(1, 6.3, 10) 
        mesh.position.set(0.38, 10, 1) 
        mesh.renderOrder = 2;

       cube.position.set(-20, 2, -20) 
       cube.castShadow = true
       scene.add(cube);
       mesh2.rotation.set(4.7, 6.3, 9.4) 
       mesh2.position.set(-1.64, -2.6, -3) 
       mesh2.renderOrder = 2;
       
       circle.position.set(20, 7, 20) 
       circle.castShadow = true;
       scene.add(circle);
       mesh3.rotation.set(4.7, 6.3, 9.4) 
       mesh3.position.set(-1.64, -7.04, -1.64) 
       mesh3.renderOrder = 2;

       //create Gui
       const gui = new GUI();
       const circleFolder = gui.addFolder('Circle Materials')
       const dodecFolder = gui.addFolder('Dodec Materials')
       const cubeFolder = gui.addFolder('Cube Materials')
       const lightingFolder = gui.addFolder('Lighting')

       //lighting
       lightingFolder.add( params, 'bakedShadows').onChange( function() {
        toggleBakedShadows()
       } );
       //direct light
       lightingFolder.add( params, 'dirLight').onChange( function() {
        dirLightToggle()
       } );
       lightingFolder.add(lightingParams, 'dirLightX', -60, 60 ).onChange( function() { 
          dirLight.position.setX(lightingParams.dirLightX); render()
          scene.remove(scene.getObjectByName( "dirLight", true ))
          scene.add(dirLight)
          scene.remove(scene.getObjectByName( "dirLightH", true ))
          scene.add(helper)
        })
       lightingFolder.add(lightingParams, 'dirLightY', 0, 60 ).onChange( function() {dirLight.position.setY(lightingParams.dirLightY); render() 
          scene.remove(scene.getObjectByName( "dirLight", true ))
          scene.add(dirLight)
          scene.remove(scene.getObjectByName( "dirLightH", true ))
          scene.add(helper)
       })
       lightingFolder.add(lightingParams, 'dirLightZ', -60, 60 ).onChange( function() {dirLight.position.setZ(lightingParams.dirLightZ); render() 
          scene.remove(scene.getObjectByName( "dirLight", true ))
          scene.add(dirLight)
          scene.remove(scene.getObjectByName( "dirLightH", true ))
          scene.add(helper)
       })
      lightingFolder.add(lightingParams, 'dirIntensity', 0, 100 ).onChange( function() {dirLight.intensity = lightingParams.dirIntensity;
          render() 
          scene.remove(scene.getObjectByName( "dirLight", true ))
          scene.add(dirLight)
          scene.remove(scene.getObjectByName( "dirLightH", true ))
          scene.add(helper)
       })
       //spot light
        lightingFolder.add( params, 'spotLight').onChange( function() {
            spotLightToggle()
        } );
        lightingFolder.add(lightingParams, 'spotLightX', -60, 60 ).onChange( function() { 
          spotLight.position.setX(lightingParams.spotLightX); render()
          scene.remove(scene.getObjectByName( "spotLight", true ))
          scene.add(spotLight)
          scene.remove(scene.getObjectByName( "spotLightH", true ))
          scene.add(spotLightHelper)
        })
       lightingFolder.add(lightingParams, 'spotLightY', 0, 60 ).onChange( function() {spotLight.position.setY(lightingParams.spotLightY); render() 
          scene.remove(scene.getObjectByName( "spotLight", true ))
          scene.add(spotLight)
          scene.remove(scene.getObjectByName( "spotLightH", true ))
          scene.add(spotLightHelper)
       })
       lightingFolder.add(lightingParams, 'spotLightZ', -60, 60 ).onChange( function() {spotLight.position.setZ(lightingParams.spotLightZ); render() 
          scene.remove(scene.getObjectByName( "spotLight", true ))
          scene.add(spotLight)
          scene.remove(scene.getObjectByName( "spotLightH", true ))
          scene.add(spotLightHelper)
       })
        lightingFolder.add(lightingParams, 'spotIntensity', 0, 400, 25 ).onChange( function() {spotLight.intensity = lightingParams.spotIntensity;
          spotLight.power = lightingParams.spotIntensity;
          render() 
          scene.remove(scene.getObjectByName( "spotLight", true ))
          scene.add(spotLight)
          scene.remove(scene.getObjectByName( "spotLightH", true ))
          scene.add(spotLightHelper)
       })

       //circle
       circleFolder.addColor( params, 'circleColor' ).onChange( function() { circle.material.color.set( params.circleColor ); } );
       circleFolder.add( params, 'circleMetalness', 0, 2).onChange( function() { circle.material.metalness = params.circleMetalness } );
       circleFolder.add( params, 'circleReflectiveness', 0, 1 ).onChange( function() { circle.material.roughness = params.circleReflectiveness } );

       //dodec
       dodecFolder.addColor( params, 'dodecColor' ).onChange( function() { dodec.material.color.set( params.dodecColor ); } );
       dodecFolder.add( params, 'dodecMetalness', 0, 2).onChange( function() { dodec.material.metalness = params.dodecMetalness } );
       dodecFolder.add( params, 'dodecReflectiveness', 0, 1 ).onChange( function() { dodec.material.roughness = params.dodecReflectiveness } );
        //cube
       cubeFolder.addColor( params, 'cubeColor' ).onChange( function() { cube.material.color.set( params.cubeColor ); } );
       cubeFolder.add( params, 'cubeMetalness',0, 2).onChange( function() { cube.material.metalness = params.cubeMetalness } );
       cubeFolder.add( params, 'cubeReflectiveness', 0, 1 ).onChange( function() { cube.material.roughness = params.cubeReflectiveness } );
       
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
       gui.add( params, 'cameraLocked').onChange( function() {
        cameraChange()
       } );

       const toggleBakedShadows = () =>{
           if(params.bakedShadows) {
             dodec.add(mesh)
             cube.add(mesh2)
             circle.add(mesh3)
           } else{
             dodec.remove(mesh)
             cube.remove(mesh2)
             circle.remove(mesh3)
           }
           render()
       }

       const dirLightToggle = () =>{
           if(params.dirLight) {
           scene.add( dirLight );
           scene.add( helper );
           dodec.remove(mesh)
           cube.remove(mesh2)
           circle.remove(mesh3)
           } else{
             if(!params.spotLight){
                dodec.add(mesh)
                cube.add(mesh2)
                circle.add(mesh3)
             }
           scene.remove(scene.getObjectByName( "dirLight", true ))
           scene.remove(scene.getObjectByName( "dirLightH", true ))
           }
        render()
       }
       const spotLightToggle = () =>{
           if(params.spotLight) {
             scene.add( spotLight );
             scene.add( spotLightHelper );
             console.log('remove')
             dodec.remove(mesh)
             cube.remove(mesh2)
             circle.remove(mesh3)
           } else{
             if(!params.dirLight){
                dodec.add(mesh)
                cube.add(mesh2)
                circle.add(mesh3)
             }
             scene.remove(scene.getObjectByName( "spotLight", true ))
             scene.remove(scene.getObjectByName( "spotLightH", true ))
           }
        render() 
        }

       //end of intialization and first render
       render();
       });

       renderer = new THREE.WebGLRenderer({ antialias: true });
       renderer.setPixelRatio(window.devicePixelRatio);
       renderer.setSize(window.innerWidth, window.innerHeight);
       renderer.outputEncoding = THREE.sRGBEncoding;
       renderer.toneMapping = THREE.ACESFilmicToneMapping;
       renderer.domElement.id = 'envSpinner';
       renderer.shadowMap.enabled = true;
       renderer.shadowMap.type = THREE.PCFSoftShadowMap;
       document.body.appendChild(renderer.domElement);
       window.addEventListener('resize', onWindowResize);

       let controls = new OrbitControls(camera, renderer.domElement);
       controls.addEventListener('change', render);
       controls.target.set(0, 2, 0);
       controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
       controls.maxDistance = 80;
       controls.minDistance = 20;
       controls.enablePan = false;
       controls.update();
    }
    useEffect(() => {
        initialize().then( render )
    });

    const cameraChange = () =>{
        camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
        camera.position.set(-20, 7, 20);
        camera.lookAt(0, 4, 0);
        const controls = new OrbitControls(camera, renderer.domElement)
        let mode = params.cameraLocked
        // eslint-disable-next-line
        switch( mode ) {
            case false:
                controls.addEventListener('change', render);
                controls.target.set(0, 2, 0);
                controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
                controls.maxDistance = 80;
                controls.minDistance = 20;
                controls.enablePan = false;
                controls.update();
                break;
            case true:
                controls.addEventListener('change', render);
                controls.target.set(0, 2, 0);
                controls.minPolarAngle = 1;
                controls.maxPolarAngle = 1;
                controls.maxDistance = 75;
                controls.minDistance = 75;
                controls.enablePan = false;
                controls.update();
                break;
        }

    }
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
    }

    return (<>
        <div id="container">
        </div>
        <div className="loader" id="loader">
            <DotLoader color="#d5dcef" size={100} loading={true} />
        </div> 
        
   </>);
}
