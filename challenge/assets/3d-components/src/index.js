import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import {Earth } from './earth.js';
import {Marker} from './marker.js';

const EARTH_AXIS_OF_ROTATION = 23.5;
const ROTATION_SPEED = 0.0001;
const LINE_COLOUR = 0xffff00;



function initThreeScene() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let current_marker1 = null;

    const gui = new GUI();
    gui.add({buttonText: function() { console.log('Button clicked'); markerToPlace = 1;} }, 'buttonText').name('Add Start Point');
    let markerToPlace = 0;
    let markerPositionUIX;
    let markerPositionUIY;
    let iterateBtn;



    // Earth texture and geometry
    let earth = new Earth();
    scene.add(earth.earth_sphere);

    //lines of latitude
    let linesOfLatitude = earth.generate_latitude_lines(25);
    linesOfLatitude.forEach((line) => {scene.add(line);});

    //lines of longitude
    let linesOfLongitude = earth.generate_longitude_lines(50);
    linesOfLongitude.forEach((line) => scene.add(line));
    // Camera and controls
    camera.position.z = EARTH_RADIUS * 1.5;
    camera.far = EARTH_RADIUS * 4;
    camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Earth's rotation axis
    const earthAxis = new THREE.Vector3(0, Math.tan(EARTH_AXIS_OF_ROTATION * Math.PI / 180), 0);

    // Axis visualization
    const arrowHelper = new THREE.ArrowHelper(earthAxis.clone().normalize(), new THREE.Vector3(0, 0, 0), 10, LINE_COLOUR);
    scene.add(arrowHelper);



    window.addEventListener('click', function(mouse){
        let mouse_check = earth.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera);
        if (mouse_check != null && markerToPlace != 0){
            if (markerPositionUIX){
                gui.remove(markerPositionUIX);
            };
            if (markerPositionUIY){
                gui.remove(markerPositionUIY);
            };
            if (iterateBtn){
                gui.remove(iterateBtn);
            }
            console.log(mouse_check.point);
            current_marker1 = place_marker(mouse_check.point, scene, current_marker1);
            markerToPlace = 0;
            markerPositionUIX = gui.add(current_marker1.sphere.position, 'x').name('Xpos');
            markerPositionUIY = gui.add(current_marker1.sphere.position, 'y').name('Ypos');
            iterateBtn = gui.add({buttonText: function() {current_marker1.pr.iterate();}}, 'buttonText').name('Iterate by TimeStep');

            
        };

    })
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        earth.earth_sphere.rotateOnAxis(earthAxis, ROTATION_SPEED);
        if (current_marker1){
            current_marker1.pr.iterate();

        }
        renderer.render(scene, camera);
    }
    animate();
}

function place_marker(position, scene, current){
    if (current) current.kill(scene);
    let marker = new Marker(position);
    marker.sphere.position.set(position.x, position.y, position.z)
    marker.create_projectile();
    scene.add(marker.sphere);
    console.log(marker.pr.sphere);
    scene.add(marker.pr.sphere);
    return marker;
}

window.onload = initThreeScene;
