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
    sun: '/assets/textures/sun.jpg',
    mercury: '/assets/textures/mercury.jpg',
    venus: '/assets/textures/venus.jpg',
    mars: '/assets/textures/mars.jpg',
    jupiter: '/assets/textures/jupiter.jpg',
    saturn: '/assets/textures/saturn.jpg',
    uranus: '/assets/textures/uranus.jpg',
    neptune: '/assets/textures/neptune.jpg',


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
    let current_planet = false;

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
        liveBtn: null,
        orbit: null,
        earth_axis_tilt: null
    }

    const inputDataLengths = {
        startPosLat: 11,
        startposLong: 11,
        launchSpeed: 10,
        launchDir: 10,
        launchAngle: 10,

        maxLaunchSpeed: 20,
        maxLaunchDir: 360,
        maxLaunchAngle: 60,
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

    console.log(inputDataParams.startPos.lat);
    console.log(inputDataParams.startPos.long)
    let line_parabola;



    const planets = {
        sun: null,
        mercury: null,
        venus: null,
        earth: null,
        mars: null,
        jupiter: null,
        saturn: null,
        uranus: null,
        neptune: null,
        moon: null,
        length: 10
    }
    const sundata = planetary_data.sun
    const sun = new CelestialBody(textures.sun, sundata.M, sundata.R,'sun')
    scene.add(sun.sphere);
    scene.add(sun.sprite);
    sun.sphere.position.set(0, 0, 0);
    sun.sprite.position.set(0, 0, 0);
    planets.sun = sun;

    for (let i = 0;i < planets.length; i++) {
        const pname = Object.keys(planets)[i];
        if (pname == 'earth'|| pname == 'sun' || pname == 'moon'){
            continue;
        }
        const planetdata = planetary_data[pname];
        const planet = new CelestialBody(textures[pname], planetdata.M, planetdata.R, 'pname', planetdata.aAU, planetdata.Yr, planetdata.ecc, planetdata.beta);
        scene.add(planet.sphere);
        scene.add(planet.sprite);
        scene.add(planet.trailLine);
        planets[pname] = planet;
    }

    // Earth texture and geometry
    const earth = new Earth();
    scene.add(earth.sphere);
    scene.add(earth.sprite);
    earth.sphere.position.set(AU, 0, 0);
    earth.sprite.position.set(AU, 0, 0);
    scene.add(earth.trailLine);
    planets.earth = earth;

    const moon = new Moon(earth.sphere.position);
    scene.add(moon.sphere);
    scene.add(moon.trailLine);
    planets.moon = moon;

    //lines of latitude
    let linesOfLatitude = earth.generate_latitude_lines(25);
    linesOfLatitude.forEach((line) => {scene.add(line);});

    //lines of longitude
    let linesOfLongitude = earth.generate_longitude_lines(50);
    linesOfLongitude.forEach((line) => scene.add(line));
    // // Camera and controls
    camera.position.x = sundata.R * EARTH_RADIUS * 1.5;
    camera.far = earth.sphere.position.length() * 100000000;
    camera.updateProjectionMatrix();
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.zoomSpeed = 4.0;
    controls.update();



    

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
                neptune: false,
                moon: false
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
            target_planet = planets[target_controls.target].sphere.position
            console.log(this.targets);
        }
    }

    const target_controls = new Target_controls()
    let target_planet = planets['earth'].sphere.position
    console.log(planets);
    console.log(planets.earth.sphere.position);


    target_planet_folder.open();
    target_planet_folder.add(target_controls.targets, 'sun').onChange(()=> target_controls.set_target(0))
    target_planet_folder.add(target_controls.targets, 'mercury').onChange(()=>target_controls.set_target(1))
    target_planet_folder.add(target_controls.targets, 'venus').onChange(()=>target_controls.set_target(2))
    target_planet_folder.add(target_controls.targets, 'earth').onChange(()=>target_controls.set_target(3))
    target_planet_folder.add(target_controls.targets, 'mars').onChange(()=>target_controls.set_target(4))
    // target_planet_folder.add(target_controls.targets, 'jupiter').onChange(()=>target_controls.set_target(5))
    // target_planet_folder.add(target_controls.targets, 'saturn').onChange(()=>target_controls.set_target(6))
    // target_planet_folder.add(target_controls.targets, 'uranus').onChange(()=>target_controls.set_target(7))
    // target_planet_folder.add(target_controls.targets, 'neptune').onChange(()=>target_controls.set_target(8))
    target_planet_folder.add(target_controls.targets, 'moon').onChange(()=>target_controls.set_target(9))

    target_planet_folder.close();



    // Earth's rotation axis
    earth.earthAxis = new THREE.Vector3(0, 1 / Math.tan(deg2rad(EARTH_AXIS_OF_ROTATION)), 0);

    // Axis visualization
    const arrowHelper = new THREE.ArrowHelper(earth.earthAxis.clone().normalize(), new THREE.Vector3(0, 0, 0), EARTH_RADIUS*2, LINE_COLOUR);
    // const arrowHelper2 = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), EARTH_RADIUS*2, LINE_COLOUR);

    scene.add(arrowHelper);
    // scene.add(arrowHelper2);

    gui.add({buttonText: function() {
        let results = [];
        const projectile = new Projectile(0, EARTH_RADIUS, 0, earth.sphere.position);
        projectile.numIterations = 10000;
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
                            if (lat > 90 || lat < -90){
                                lat += (-2 * random_modifier);
                            }
                            long += random_modifier;
                            if (long > 180 || long < -180){
                                long += (-2 * random_modifier)
                            }

                            posy = convert_to_y(lat, EARTH_RADIUS);
                            [posx, posz] = convert_to_xz(long, lat, 0, EARTH_RADIUS);

                            if (angle + random_modifier > 0){
                                angle += random_modifier;

                            }

                            speed += random_modifier * 0.1;
                            speed = Math.abs(speed);
                            direction += random_modifier;


                            projectile.initial_position.y = posy;
                            projectile.initial_position.x = posx;
                            projectile.initial_position.z = posz;
                            projectile.launch_angle = angle;
                            projectile.launch_speed = speed;
                            projectile.launch_direction = direction;
                            projectile.reset();
                            let [finalPos, numPoints] = projectile.iterate(true);
                            if (numPoints == -1){
                                return;
                            }
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

        // let earth_check = earth.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera);
        // if (earth_check != null){
        //     mouse_check == earth_check;
        // }
        // let moon_check = moon.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera);
        // if (moon_check){
        //     mouse_check = moon_check;
        // }
        let planet_check = null;
        let mouse_check = null;

        Object.keys(planets).forEach((planet) => {
            if (planet == 'sun' || planet=='length') {
                return;
            }
            let check = planets[planet].check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera)
            if (check != null){
                planet_check = planet;
                mouse_check = check;
                current_planet = planet;
            }})

        console.log(current_planet);

        if ((mouse_check != null) && markerToPlace != 0){
            if (params.initial_v_param){
                for (let index = 0; index < Object.keys(params).length; index++){
                    let param = Object.keys(params)[index];
                    if (params[param] != null){
                        gui.remove(params[param]);
                    }
                    params[param] = null;
                }
            }
            current_marker1 = place_marker(mouse_check.point, scene, current_marker1, planet_check, planets);

            update_live_rotation();
            markerToPlace = 0;

            if (planet_check == 'earth'){
                params.markerPositionLat = gui.add(current_marker1, 'latitude').name('Latitude');
                params.markerPositionLong = gui.add(current_marker1, 'longitude').name('Longitude');
            }
            params.initial_v_param = gui.add(current_marker1.pr, 'launch_speed', 0.1, 100).name('Launch Speed (km/s)');
            params.initial_theta_param = gui.add(current_marker1.pr, 'launch_angle', 0, 90).name('Launch Angle');
            params.initial_direction_param = gui.add(current_marker1.pr, 'launch_direction', 0, 360).name('Launch Direction');
            params.projectile_mass = gui.add(current_marker1.pr, 'mass', 0, 1000).name('Mass (kg)');
            params.area = gui.add(current_marker1.pr, 'cross_sectional_area', 0, 1000).name('Area (m^2)');

            


            
            params.iterateBtn = gui.add({buttonText: function() {
                if (line_parabola){
                    scene.remove(line_parabola)
                }
                let earthTrue = (current_marker1.pr.planet_radius == EARTH_RADIUS)
                current_marker1.pr.reset(scene);
                if (earthTrue)
                    update_long_lat();
                line_parabola = current_marker1.pr.iterate();
                let line_points = line_parabola.geometry.getAttribute('position');
                scene.add(line_parabola);
                console.log("line points", line_points.count);
                //rotate earth

                if (earthTrue){
                    let rotationAmount = LiveRotationAmount * (line_points.count / 3);
                    console.log('rotationAmount', rotationAmount);
                    earth.sphere.rotateOnAxis(earth.earthAxis.normalize(), rotationAmount);
                    earth.rotation += rotationAmount;
                    current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation); 
                }

                current_marker1.pr.current_path = line_points;
                console.log(line_points);

            }}, 'buttonText').name('Iterate by TimeStep');
            params.iterateSteps = gui.add(current_marker1.pr, 'numIterations', 10, 50000).name('Num Iterations');
            params.timestep = gui.add(current_marker1.pr, 'timestep', 0, 1000).name('TimeStep');
            params.orbit = gui.add(earth, 'orbit');
            params.earth_axis_tilt = gui.add(earth, 'axisTilt').name('Earth Axis Tilt').onChange(() => {
                if (earth.axisTilt){
                    earth.earthAxis = new THREE.Vector3(0, Math.tan(deg2rad(90-EARTH_AXIS_OF_ROTATION)), 1);
                    earth.sphere.rotation.x = (deg2rad(EARTH_AXIS_OF_ROTATION));
                }
                else {
                    earth.earthAxis = new THREE.Vector3(0, 1, 0);
                    earth.sphere.rotation.x = 0;
                }
            });

        moon.check_mouse_intersection(mouse.clientX, mouse.clientY, window, camera)
        // let out = (live == true) ? 'stop live' : 'run live'
        params.liveBtn = gui.add({buttonText: function() {
            live = !live; 
            if (!live) {
                first_of_iterations = true;           
            }
            else {
                linesOfLongitude.forEach((line) => scene.remove(line));
                linesOfLatitude.forEach((line) => {scene.remove(line);});
                if (current_planet = 'earth'){
                    update_long_lat();
                }

                // target_controls.targets.sun = true;
                // target_controls.set_target(0);
                // update_camera_target();
            }
            }}, 'buttonText').name('Start/stop live');
        };
        if (planet_check == 'earth'){
            params.markerPositionLat.onChange(() => {update_long_lat()});
            params.markerPositionLong.onChange(() => (update_long_lat()));
            params.timestep.onChange(function () {
                update_live_rotation()
            })
        }



    })

    function update_live_rotation(){
        LiveRotationAmount = current_marker1.pr.timestep / (3600 * 24) * Math.PI * 2;
    }
    function update_long_lat(){
        current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);
        current_marker1.pr.reset();
        console.log("update")

    }
    function update_camera_target() {
        controls.target = target_planet;
        console.log(controls.target);
        if (target_controls.target == 'earth'){}
        let camera_pos = new THREE.Vector3(planets[target_controls.target].radius * 1.5, 0, 0).clone().add(target_planet)
        camera.position.set(camera_pos.x, camera_pos.y, camera_pos.z);
        console.log(camera.position);
    }
    // Animation loop
    function animate() {
        // earth.sphere.rotateOnAxis(earth.earthAxis, ROTATION_SPEED);
        // earth.rotation += ROTATION_SPEED;
        // if (current_marker1){
        //     current_marker1.pr.iterate();
 
        // }
        if (controls.target != target_planet){
            update_camera_target()
        }

        if (live){
            const dt = current_marker1.pr.timestep
            for (let _ = 0; _ < FRAME_ITERATIONS; _++){

                if (earth.orbit){
                    earth.iterate(dt)
                    Object.keys(planets).forEach((planet) => {
                        if (planet == 'earth' || planet == 'sun' || planet == 'length' || planet == 'moon'){
                            return;
                        }
                        planets[planet].iterate(dt)
                    })
                    moon.iterate(dt, earth.sphere.position);
                }

            current_marker1.pr.iterate_once(first_of_iterations, planets[current_marker1.pr.planet_name].sphere.position);
            earth.rotation += LiveRotationAmount;
            earth.rotation %= Math.PI * 2
            rotate(earth.earthAxis, LiveRotationAmount, earth)
            }
            // current_marker1.set_pos(current_marker1.latitude, current_marker1.longitude, earth.rotation);
            // if (first_of_iterations){
            //     let temp= target_controls.target;
            //     target_controls.targets.sun = true;
            //     target_controls.set_target(0);
            //     update_camera_target();
            //     target_controls.targets[temp] = true;
            //     target_controls.set_target(Object.keys(target_controls.targets).indexOf(temp));
            //     update_camera_target();
            // }
            first_of_iterations = false;
            



        }
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);

        requestAnimationFrame(animate);

    }


    animate();
}

function rotate (axis, angle, earth) {
    let rotMat = new THREE.Matrix4().makeRotationAxis(axis, angle);
    rotMat.multiply(earth.sphere.matrix);
    let rotMat2 = new THREE.Matrix4().extractRotation(rotMat);
    let rotQuat = new THREE.Quaternion().setFromRotationMatrix(rotMat2);
    earth.sphere.quaternion.copy(rotQuat);
    earth.sphere.updateMatrix();
  }

function place_marker(position, scene, current, planet, planets){
    console.log("hello")
    if (current) current.kill(scene);
    let marker = new Marker(planets[planet].sphere.position);
    marker.sprite.position.set(position.x, position.y, position.z)
    if (planet == 'earth'){
        marker.calculate_long_lat(planets[planet].rotation, planets[planet].axisTilt);
    }
    
    marker.create_projectile();
    marker.pr.planet_radius = planets[planet].radius;
    marker.pr.planet_mass = planets[planet].mass;
    marker.pr.planet_name = planet;
    scene.add(marker.sprite);
    scene.add(marker.pr.sphere);



    return marker;
}

window.onload = initThreeScene;
