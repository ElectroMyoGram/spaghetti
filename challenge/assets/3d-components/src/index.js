import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import {Earth } from './earth.js';
import {Marker} from './marker.js';
import {Moon} from './moon.js';
import {Projectile} from './projectile.js';

const ROTATION_SPEED = 0.0001;
const MOUSE_SENSITIVITY = 0.001;
const CAMERA_SPEED = 100;

let is_dragging = false;


function initThreeScene() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let current_marker1 = null;

    const gui = new GUI();
    let markerToPlace = 0;

    gui.add({buttonText: function() { markerToPlace = 1;} }, 'buttonText').name('Add Start Point');
    let params = {
        markerPositionLat: null,
        markerPositionLong: null,
        iterateBtn: null,
        iterateSteps: null,
        timestep: null,
        initial_v_param: null,
        initial_theta_param: null,
        initial_direction_param: null,
        projectile_mass: null,
        area: null
    }

    const inputDataLengths = {
        startPosLat: 11,
        startposLong: 11,
        launchSpeed: 10,
        launchDir: 10,
        launchAngle: 10,

        maxLaunchSpeed: 320,
        maxLaunchDir: 360,
        maxLaunchAngle: 90,
    }

    const inputDataParams = {
        startPos: {
            lat: Array.from( {length: inputDataLengths.startPosLat}, (_, i) => (i * (180 / (inputDataLengths.startPosLat - 1))) - 90),
            long: Array.from( {length: inputDataLengths.startposLong}, (_, i) => (i * (360 / (inputDataLengths.startposLong - 1))) - 180)
        },
        launchSpeed: Array.from( {length: inputDataLengths.launchSpeed }, (_, i) => i * (inputDataLengths.maxLaunchSpeed / (inputDataLengths.launchSpeed))),
        launchDir: Array.from( {length: inputDataLengths.launchDir}, (_, i) => i * (inputDataLengths.maxLaunchDir / inputDataLengths.launchDir)),
        launchAngle: Array.from( {length: inputDataLengths.launchAngle}, (_, i) => i * (inputDataLengths.maxLaunchAngle / (inputDataLengths.launchAngle - 1))),
        mass: 100,
        area: 0.1,
        startingEarthRot: 0

    }
    let line_parabola;

    // Earth texture and geometry
    const earth = new Earth();
    scene.add(earth.earth_sphere);

    const moon = new Moon();
    scene.add(moon.moon_sphere);
    moon.moon_sphere.position.set(0, 0, MOON_ORBITAL_RADIUS);

    //lines of latitude
    let linesOfLatitude = earth.generate_latitude_lines(25);
    linesOfLatitude.forEach((line) => {scene.add(line);});

    //lines of longitude
    let linesOfLongitude = earth.generate_longitude_lines(50);
    linesOfLongitude.forEach((line) => scene.add(line));
    // Camera and controls
    camera.position.x = EARTH_RADIUS * 1.5;
    camera.far = EARTH_RADIUS * 1000;
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

    gui.add({buttonText: function() {
        let results = [];
        const projectile = new Projectile(0, EARTH_RADIUS, 0);
        projectile.numIterations = 500000;
        projectile.mass = inputDataParams.mass;
        projectile.cross_sectional_area = inputDataParams.area;
        
        let posy, posx, posz;
        let random_modifier;
        const random_factor = 5;
        console.log('started');
        inputDataParams.startPos.lat.forEach( lat => {

            inputDataParams.startPos.long.forEach( long => {


                inputDataParams.launchSpeed.forEach( speed => {

                    inputDataParams.launchAngle.forEach( angle => {
                        
                        inputDataParams.launchDir.forEach( direction => {
                            random_modifier = (Math.random() * 2 - 1) * random_factor;


                            lat += random_modifier;
                            long += random_modifier;
                            posy = convert_to_y(lat, EARTH_RADIUS);
                            [posx, posz] = convert_to_xz(long, lat, 0, EARTH_RADIUS);


                            posz += random_modifier;
                            angle += random_modifier;
                            speed += random_modifier;
                            direction += random_modifier;


                            projectile.initial_position.y = posy;
                            projectile.initial_position.x = posx;
                            projectile.initial_position.z = posz;
                            projectile.launch_angle = angle;
                            projectile.launch_speed = speed;
                            projectile.launch_direction = direction;
                            projectile.reset();
                            let [finalPos, numPoints] = projectile.iterate(true);
                            // console.log(finalPos);
                            let rotationAmount = 15/180 * Math.PI * (1 / 3600) * projectile.timestep * numPoints;

                            let endlat = rad2deg(convert_to_latitude(finalPos.y, EARTH_RADIUS))
                            if (endlat == null){
                                console.log("infinity");
                                console.log('speed', projectile.launch_speed);
                                alert('STOP');
                                return;
                            }

                            results.push( {
                                startLat: lat,
                                startLong: long,
                                endLat: endlat, 
                                endlong: rad2deg(convert_to_longitude(finalPos.x, finalPos.z, rotationAmount)),
                                launchSpeed: speed,
                                launchAngle: angle,
                                launchDir: direction
                            })
                        
                        });
                    });
                });
                console.log(' 1 / 11**2')
            });
            console.log('1 / 11')
        });

        const csvData = convertToCSV(results);
        downloadCSV(csvData, 'simulation_results.csv');

    }}, 'buttonText').name('Generate Data');

    window.addEventListener('click', function(mouse){
        let mouse_check = earth.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera) || moon.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera);
        if (mouse_check != null && markerToPlace != 0){
            if (params.markerPositionLat){
                for (let index = 0; index < Object.keys(params).length; index++){
                    let param = Object.keys(params)[index];
                    gui.remove(params[param]);
                    params[param] = null;
                }
            }
            current_marker1 = place_marker(mouse_check.point, scene, current_marker1, earth);
            markerToPlace = 0;
            params.markerPositionLat = gui.add(current_marker1, 'latitude').name('Latitude');
            params.markerPositionLong = gui.add(current_marker1, 'longitude').name('Longitude');
            params.initial_v_param = gui.add(current_marker1.pr, 'launch_speed', 1, 500).name('Launch Speed (km/s)');
            params.initial_theta_param = gui.add(current_marker1.pr, 'launch_angle', 0, 90).name('Launch Angle');
            params.initial_direction_param = gui.add(current_marker1.pr, 'launch_direction', 0, 360).name('Launch Direction');
            params.projectile_mass = gui.add(current_marker1.pr, 'mass', 0, 1000).name('Mass (kg)');
            params.area = gui.add(current_marker1.pr, 'cross_sectional_area', 0, 1000).name('Area (m^2)');

            



            
            params.iterateBtn = gui.add({buttonText: function() {
                if (line_parabola){
                    scene.remove(line_parabola)
                }
                current_marker1.pr.reset(scene);
                line_parabola = current_marker1.pr.iterate();
                let line_points = line_parabola.geometry.getAttribute('position');
                scene.add(line_parabola);

                //rotate earth
                let rotationAmount = 15/180 * Math.PI * (1 / 3600) * current_marker1.pr.timestep * (line_points.count / 3);
                console.log('rotationAmount', rotationAmount);
                earth.earth_sphere.rotateOnAxis(earthAxis.normalize(), rotationAmount);
                earth.rotation += rotationAmount;
                current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);

            }}, 'buttonText').name('Iterate by TimeStep');
            params.iterateSteps = gui.add(current_marker1.pr, 'numIterations', 10, 500000).name('Num Iterations');
            params.timestep = gui.add(current_marker1.pr, 'timestep', 0, 10).name('TimeStep');
        };

        params.markerPositionLat.onChange(update_long_lat());
        params.markerPositionLong.onChange(update_long_lat());


    })

    function update_long_lat(){
        current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);
        current_marker1.pr.reset();
    }
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        // earth.earth_sphere.rotateOnAxis(earthAxis, ROTATION_SPEED);
        // earth.rotation += ROTATION_SPEED;
        // if (current_marker1){
        //     current_marker1.pr.iterate();

        // }
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    }
    animate();
}

function place_marker(position, scene, current, earth){
    if (current) current.kill(scene);
    let marker = new Marker();
    marker.sprite.position.set(position.x, position.y, position.z)
    marker.calculate_long_lat(earth.rotation);
    marker.create_projectile();
    scene.add(marker.sprite);
    console.log(marker.pr.sphere);
    scene.add(marker.pr.sphere);
    scene.add(marker.pr.arrowHelper1);
    scene.add(marker.pr.arrowHelper2);
    scene.add(marker.pr.arrowHelper3);



    return marker;
}

window.onload = initThreeScene;
