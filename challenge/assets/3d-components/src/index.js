import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import {Earth } from './earth.js';
import {Marker} from './marker.js';

const ROTATION_SPEED = 0.0001;



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
    let params = {
        markerPositionUIX: null,
        markerPositionUIY: null,
        iterateBtn: null,
        iterateSteps: null,
        initial_v_param: null,
        initial_theta_param: null,
        initial_direction_param: null
    }

    let line_parabola;




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
    camera.position.x = EARTH_RADIUS * 1.5;
    camera.far = EARTH_RADIUS * 8;
    camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    // Earth's rotation axis
    const earthAxis = new THREE.Vector3(0, 1 / Math.tan(deg2rad(EARTH_AXIS_OF_ROTATION)), 0);

    // Axis visualization
    const arrowHelper = new THREE.ArrowHelper(earthAxis.clone().normalize(), new THREE.Vector3(0, 0, 0), EARTH_RADIUS*2, LINE_COLOUR);
    // const arrowHelper2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), EARTH_RADIUS*2, LINE_COLOUR);

    scene.add(arrowHelper);
    // scene.add(arrowHelper2);



    window.addEventListener('click', function(mouse){
        let mouse_check = earth.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera);
        if (mouse_check != null && markerToPlace != 0){
            if (params.markerPositionUIX){
                for (let index = 0; index < Object.keys(params).length; index++){
                    let param = Object.keys(params)[index];
                    gui.remove(params[param]);
                    params[param] = null;
                }
            }
            current_marker1 = place_marker(mouse_check.point, scene, current_marker1, earth);
            markerToPlace = 0;
            params.markerPositionUIX = gui.add(current_marker1, 'latitude').name('Latitude');
            params.markerPositionUIY = gui.add(current_marker1, 'longitude').name('Longitude');
            params.initial_v_param = gui.add(current_marker1.pr, 'launch_speed', 1, 1000).name('Launch Speed');
            params.initial_theta_param = gui.add(current_marker1.pr, 'launch_angle', 0, 90).name('Launch Angle');
            params.initial_direction_param = gui.add(current_marker1.pr, 'launch_direction', 0, 360).name('Launch Direction');

            
            params.iterateBtn = gui.add({buttonText: function() {
                if (line_parabola){
                    scene.remove(line_parabola)
                }
                current_marker1.pr.reset(scene);
                line_parabola = current_marker1.pr.iterate();
                scene.add(line_parabola);

                //rotate earth
                let rotationAmount = 15/180 * Math.PI * (1 / 3600) * current_marker1.pr.timestep * current_marker1.pr.numIterations
                console.log('rotationAmount', rotationAmount);
                earth.earth_sphere.rotateOnAxis(earthAxis.normalize(), rotationAmount);
                earth.rotation += rotationAmount;

            }}, 'buttonText').name('Iterate by TimeStep');
            params.iterateSteps = gui.add(current_marker1.pr, 'numIterations', 10, 500000).name('Num Iterations')


            
        };

    })
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        earth.earth_sphere.rotateOnAxis(earthAxis, ROTATION_SPEED);
        earth.rotation += ROTATION_SPEED;
        // if (current_marker1){
        //     current_marker1.pr.iterate();

        // }
        renderer.render(scene, camera);
    }
    animate();
}

function place_marker(position, scene, current, earth){
    if (current) current.kill(scene);
    let marker = new Marker(position);
    marker.sphere.position.set(position.x, position.y, position.z)
    marker.calculate_long_lat(earth.rotation);
    marker.create_projectile();
    scene.add(marker.sphere);
    console.log(marker.pr.sphere);
    scene.add(marker.pr.sphere);
    scene.add(marker.pr.arrowHelper1);
    scene.add(marker.pr.arrowHelper2);
    scene.add(marker.pr.arrowHelper3);



    return marker;
}

window.onload = initThreeScene;
