import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'dat.gui';

import {Earth } from './earth.js';
import {Marker} from './marker.js';
import {Moon} from './moon.js';
import {Projectile} from './projectile.js';
import {CelestialBody} from './celestial_body.js';

const ROTATION_SPEED = 0.0001;
const MOUSE_SENSITIVITY = 0.001;
const CAMERA_SPEED = 100;

let is_dragging = false;

const textures =  {
    sun: '/assets/textures/sun.jpg'
}

function initThreeScene() {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    let current_marker1 = null;

    let live = false;
    let first_of_iterations = true;
    let LiveRotationAmount;

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
        area: null,
        liveBtn: null
    }

    const inputDataLengths = {
        startPosLat: 11,
        startposLong: 11,
        launchSpeed: 10,
        launchDir: 10,
        launchAngle: 10,

        maxLaunchSpeed: 230,
        maxLaunchDir: 360,
        maxLaunchAngle: 90,
    }

    const inputDataParams = {
        startPos: {
            lat: Array.from( {length: inputDataLengths.startPosLat}, (_, i) => (i * (180 / (inputDataLengths.startPosLat - 1))) - 90),
            long: Array.from( {length: inputDataLengths.startposLong}, (_, i) => (i * (360 / (inputDataLengths.startposLong - 1))) - 180)
        },
        launchSpeed: Array.from( {length: inputDataLengths.launchSpeed }, (_, i) => i * (inputDataLengths.maxLaunchSpeed / (inputDataLengths.launchSpeed)) + 50),
        launchDir: Array.from( {length: inputDataLengths.launchDir}, (_, i) => i * (inputDataLengths.maxLaunchDir / inputDataLengths.launchDir)),
        launchAngle: Array.from( {length: inputDataLengths.launchAngle}, (_, i) => i * (inputDataLengths.maxLaunchAngle / (inputDataLengths.launchAngle - 1))),
        mass: 100,
        area: 0.1,
        startingEarthRot: 0

    }

    console.log(inputDataParams.startPos.lat);
    console.log(inputDataParams.startPos.long)
    let line_parabola;

    const sundata = planetary_data.sun
    const sun = new CelestialBody(textures.sun, sundata.M, sundata.R,'sun')
    scene.add(sun.sphere);
    scene.add(sun.sprite);
    sun.sphere.position.set(0, 0, 0);

    
    // Earth texture and geometry
    const earth = new Earth();
    scene.add(earth.earth_sphere);
    scene.add(earth.sprite);
    earth.earth_sphere.position.set(AU, 0, 0);
    earth.sprite.position.set(AU, 0, 0);
    scene.add(earth.trailLine);

    const moon = new Moon();
    scene.add(moon.moon_sphere);
    let moonPosition = new THREE.Vector3(0, 0, MOON_ORBITAL_RADIUS) + earth.earth_sphere.position
    moon.moon_sphere.position.set(moonPosition.x, moonPosition.y, moonPosition.z);
    

    //lines of latitude
    let linesOfLatitude = earth.generate_latitude_lines(25);
    linesOfLatitude.forEach((line) => {scene.add(line);});

    //lines of longitude
    let linesOfLongitude = earth.generate_longitude_lines(50);
    linesOfLongitude.forEach((line) => scene.add(line));
    // // Camera and controls
    camera.position.x = sundata.R * EARTH_RADIUS * 1.5;
    camera.far = earth.earth_sphere.position.length() * 100000000;
    camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();



    const target_identifiers = {
        'sun': sun.sphere.position,
        'earth': earth.earth_sphere.position
    }
    const target_planet_folder = gui.addFolder('Target');
    class Target_controls{
        constructor(){
            this.target = 'earth'
            this.targets = {
                sun: false,
                mercury: false,
                venus: false,
                earth: true,
                mars: false,
                jupiter: false,
                saturn: false,
                uranus: false,
                neptune: false
            }
        }
        set_target(i){
            console.log("change")
            if (this.targets[Object.keys(this.targets)[i]] == false){
                return;
            }
            for (let j = 0; j < Object.keys(this.targets).length; j++){
                if (j == i){
                    console.log("hioeoah", j)

                    this.targets[Object.keys(this.targets)[j]] = true;
                    this.target = Object.keys(this.targets)[j]
                }
                else {
                    console.log("stop")
                    this.targets[Object.keys(this.targets)[j]] = false;
                }
            }
            target_planet_folder.__controllers.forEach(controller => controller.updateDisplay())
            target_planet = target_identifiers[target_controls.target]
            console.log(this.targets);
        }
    }
    const planet_viewing_offset = {
        'sun': new THREE.Vector3(sundata.R * EARTH_RADIUS * 1.5, 0, 0),
        'earth': new THREE.Vector3(EARTH_RADIUS * 1.5, 0, 0)
    }
    const target_controls = new Target_controls()
    let target_planet = target_identifiers[target_controls.target]


    target_planet_folder.open();
    target_planet_folder.add(target_controls.targets, 'sun').onChange(()=> target_controls.set_target(0))
    target_planet_folder.add(target_controls.targets, 'mercury').onChange(()=>target_controls.set_target(1))
    target_planet_folder.add(target_controls.targets, 'venus').onChange(()=>target_controls.set_target(2))
    target_planet_folder.add(target_controls.targets, 'earth').onChange(()=>target_controls.set_target(3))
    target_planet_folder.add(target_controls.targets, 'mars').onChange(()=>target_controls.set_target(4))
    target_planet_folder.add(target_controls.targets, 'jupiter').onChange(()=>target_controls.set_target(5))
    target_planet_folder.add(target_controls.targets, 'saturn').onChange(()=>target_controls.set_target(6))
    target_planet_folder.add(target_controls.targets, 'uranus').onChange(()=>target_controls.set_target(7))
    target_planet_folder.add(target_controls.targets, 'neptune').onChange(()=>target_controls.set_target(8))
    target_planet_folder.close();
   



    // Earth's rotation axis
    const earthAxis = new THREE.Vector3(0, 1 / Math.tan(deg2rad(EARTH_AXIS_OF_ROTATION)), 0);

    // Axis visualization
    const arrowHelper = new THREE.ArrowHelper(earthAxis.clone().normalize(), new THREE.Vector3(0, 0, 0), EARTH_RADIUS*2, LINE_COLOUR);
    // const arrowHelper2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), EARTH_RADIUS*2, LINE_COLOUR);

    scene.add(arrowHelper);
    // scene.add(arrowHelper2);

    // gui.add({buttonText: function() {
    //     let results = [];
    //     const projectile = new Projectile(0, EARTH_RADIUS, 0);
    //     projectile.numIterations = 500000;
    //     projectile.mass = inputDataParams.mass;
    //     projectile.cross_sectional_area = inputDataParams.area;
        
    //     let posy, posx, posz;
    //     let random_modifier;
    //     const random_factor = 5;
    //     console.log('started');
    //     inputDataParams.startPos.lat.forEach( lat => {

    //         inputDataParams.startPos.long.forEach( long => {


    //             inputDataParams.launchSpeed.forEach( speed => {

    //                 inputDataParams.launchAngle.forEach( angle => {
                        
    //                     inputDataParams.launchDir.forEach( direction => {
    //                         random_modifier = (Math.random() * 2 - 1) * random_factor;
                            


    //                         lat += random_modifier;
    //                         if (lat > 90 || lat < -90){
    //                             lat += (-2 * random_modifier);
    //                         }
    //                         long += random_modifier;
    //                         if (long > 180 || long < -180){
    //                             long += (-2 * random_modifier)
    //                         }

    //                         posy = convert_to_y(lat, EARTH_RADIUS);
    //                         [posx, posz] = convert_to_xz(long, lat, 0, EARTH_RADIUS);

    //                         if (angle + random_modifier > 0){
    //                             angle += random_modifier;

    //                         }
    //                         speed += random_modifier;
    //                         direction += random_modifier;


    //                         projectile.initial_position.y = posy;
    //                         projectile.initial_position.x = posx;
    //                         projectile.initial_position.z = posz;
    //                         projectile.launch_angle = angle;
    //                         projectile.launch_speed = speed;
    //                         projectile.launch_direction = direction;
    //                         projectile.reset();
    //                         let [finalPos, numPoints] = projectile.iterate(true);
    //                         // console.log(finalPos);
    //                         let rotationAmount = 15/180 * Math.PI * (1 / 3600) * projectile.timestep * numPoints;

    //                         let endlat = rad2deg(convert_to_latitude(finalPos.y, EARTH_RADIUS))
    //                         if (endlat == null){
    //                             console.log("infinity");
    //                             console.log('speed', projectile.launch_speed);
    //                             alert('STOP');
    //                             return;
    //                         }

    //                         results.push( {
    //                             startLat: lat,
    //                             startLong: long,
    //                             endLat: endlat, 
    //                             endlong: rad2deg(convert_to_longitude(finalPos.x, finalPos.z, rotationAmount)),
    //                             launchSpeed: speed,
    //                             launchAngle: angle,
    //                             launchDir: direction
    //                         })
                        
    //                     });
    //                 });
    //             });
    //             console.log(' 1 / 11**2')
    //         });
    //         console.log('1 / 11')
    //     });

    //     const csvData = convertToCSV(results);
    //     downloadCSV(csvData, 'simulation_results.csv');

    // }}, 'buttonText').name('Generate Data');

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
            update_live_rotation();
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
                update_long_lat();
                line_parabola = current_marker1.pr.iterate();
                let line_points = line_parabola.geometry.getAttribute('position');
                scene.add(line_parabola);
                console.log("line points", line_points.count);
                //rotate earth
                let rotationAmount = 15/180 * Math.PI * (1 / 3600) * current_marker1.pr.timestep * (line_points.count / 3);
                console.log('rotationAmount', rotationAmount);
                earth.earth_sphere.rotateOnAxis(earthAxis.normalize(), rotationAmount);
                earth.rotation += rotationAmount;
                current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);

                current_marker1.pr.current_path = line_points;
                console.log(line_points);

            }}, 'buttonText').name('Iterate by TimeStep');
            params.iterateSteps = gui.add(current_marker1.pr, 'numIterations', 10, 500000).name('Num Iterations');
            params.timestep = gui.add(current_marker1.pr, 'timestep', 0, 1000).name('TimeStep');
        
        // let out = (live == true) ? 'stop live' : 'run live'
        params.liveBtn = gui.add({buttonText: function() {
            live = !live; 
            if (!live) {
                first_of_iterations = true;
                update_long_lat();
     
                
            }
            else {
                linesOfLongitude.forEach((line) => scene.remove(line));
                linesOfLatitude.forEach((line) => {scene.remove(line);});

                // target_controls.targets.sun = true;
                // target_controls.set_target(0);
                // update_camera_target();
            }
            }}, 'buttonText').name('Start/stop live');
        };

        params.markerPositionLat.onChange(() => {update_long_lat()});
        params.markerPositionLong.onChange(() => (update_long_lat()));
        params.timestep.onChange(function () {
            update_live_rotation()
        })


    })

    function update_live_rotation(){
        LiveRotationAmount = 15/180 * Math.PI * (1 / 3600) * current_marker1.pr.timestep;
    }
    function update_long_lat(){
        current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);
        current_marker1.pr.reset();
        console.log("update")

    }
    function update_camera_target() {
        controls.target = target_planet;
        let camera_pos = planet_viewing_offset[target_controls.target].clone().add(target_planet)
        camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
    }
    // Animation loop
    function animate() {
        // earth.earth_sphere.rotateOnAxis(earthAxis, ROTATION_SPEED);
        // earth.rotation += ROTATION_SPEED;
        // if (current_marker1){
        //     current_marker1.pr.iterate();

        // }
        if (controls.target != target_planet){
            update_camera_target()
        }

        if (live){
  
            // earth.iterate(current_marker1.pr.timestep)
            current_marker1.pr.iterate_once(first_of_iterations, earth.earth_sphere.position);
            // current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);
            if (first_of_iterations){
                target_controls.targets.sun = true
                target_controls.set_target(0);
                update_camera_target();
                target_controls.targets.earth = true;
                target_controls.set_target(3);
                update_camera_target();
            }
            first_of_iterations = false;


            earth.earth_sphere.scale.set(1, 1, 1)
            earth.rotation += LiveRotationAmount;
            earth.rotation %= Math.PI * 2
            rotate(earthAxis, LiveRotationAmount, earth)

        }
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }
    animate();
}

function rotate (axis, angle, earth) {
    let rotMat = new THREE.Matrix4().makeRotationAxis(axis, angle);
    rotMat.multiply(earth.earth_sphere.matrix);
    let rotMat2 = new THREE.Matrix4().extractRotation(rotMat);
    let rotQuat = new THREE.Quaternion().setFromRotationMatrix(rotMat2);
    earth.earth_sphere.quaternion.copy(rotQuat);
    earth.earth_sphere.updateMatrix();
  }

function place_marker(position, scene, current, earth){
    if (current) current.kill(scene);
    let marker = new Marker(earth.earth_sphere.position);
    marker.sprite.position.set(position.x, position.y, position.z)
    marker.calculate_long_lat(earth.rotation);
    marker.create_projectile();
    scene.add(marker.sprite);
    scene.add(marker.pr.sphere);
    // scene.add(marker.pr.arrowHelper1);
    // scene.add(marker.pr.arrowHelper2);
    // scene.add(marker.pr.arrowHelper3);



    return marker;
}

window.onload = initThreeScene;
