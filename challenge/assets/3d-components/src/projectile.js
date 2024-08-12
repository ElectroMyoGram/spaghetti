import * as THREE from 'three';
import { Atmosphere } from './atmosphere.js'


export class Projectile{
    constructor(x, y, z, planetpos){
        //defines some class constants
 

        this.launch_speed = 10;
        this.mass = 100;  
        this.launch_angle = 45;
        this.launch_direction = 0;
        this.direction = 0;
        this.gravitational_magnitude = -9.8;

        this.drag_coefficient = 0.1;

        this.cross_sectional_area = 0.1;
        this.air_density = 10.0;
        this.atmosphere = new Atmosphere();

        this.k = (0.5 * this.drag_coefficient * this.air_density * this.cross_sectional_area);

        this.initial_position = new THREE.Vector3(x, y, z);
        this.initial_velocity = this.calculate_initial_velocity();

        // Current state
        this.position = this.initial_position.clone();
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        this.material_colour = new THREE.MeshBasicMaterial({color: 0x00ff00})
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        this.sphere.name = 'projectile' 
        this.sphere.position.set(this.position.x + planetpos.x, this.position.y + planetpos.y, this.position.z + planetpos.z);

        this.velocity = this.initial_velocity.clone();
        this.arrowHelper1;
        this.arrowHelper2;
        this.arrowHelper3;
        this.applyRotation();
        this.align_with_planet();
        this.acceleration = new THREE.Vector3(0, 0, 0);
        console.log(this.position, this.velocity);

        this.radius = 90

  
        this.timestep = 0.1;
        this.numIterations = 10000;
        

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            opacity: 0.8,
            transparent: true
        });

        this.current_path;
        this.onground = false;

        this.planet_initial_pos = planetpos;
        
        this.planet_radius = EARTH_RADIUS;
        this.planet_mass;
        this.planet_name;

        this.arrowHelper1;
        this.arrowHelper2;
        this.arrowHelper3;

        
    }

    calculate_initial_velocity(){
        // let vectorToEarth = this.initial_position.clone().add(-this.earth_initial_pos)
        return this.initial_position.clone().normalize().multiplyScalar(this.launch_speed * 1000);
    }
    reset(scene) {
        // scene.remove(this.arrowHelper1);
        // scene.remove(this.arrowHelper2);
        // scene.remove(this.arrowHelper3);
        this.initial_velocity = this.calculate_initial_velocity();

        this.position.copy(this.initial_position);
        this.velocity.copy(this.initial_velocity);
        this.applyRotation();
        this.align_with_planet();
    }

    
    iterate(data=false){
        const dt = this.timestep
        let points = [];

        let onground = true;
        for (let i = 0; i < this.numIterations; ++i){
            let Fgravity = (this.planet_mass * GRAVITATIONAL_CONSTANT * this.mass) / (this.position.clone().multiplyScalar(1000).lengthSq());
            // console.log("mass ", this.mass);
            // console.log("?/////////////////////////");
            let FgravityVector = this.position.clone().normalize().multiplyScalar(-1 * Fgravity);

            if (this.position.length() < this.planet_radius){
                FgravityVector.multiplyScalar(0);
                // this.velocity.clamp(new THREE.Vector3(0, 0, 0), this.position.clone().multiplyScalar(1000));
                this.velocity.multiplyScalar(0);
                if (!onground){
                    if (data){
                        return [this.position, i];
                    }
                    break;
                }
            }
            else if (onground){
                onground = false;
            }
            let h = this.position.length() - this.planet_radius;
            if (h < 0) h = 0;
            
            if (this.planet_name == 'earth'){
                this.air_density = this.atmosphere.return_density(h);
            }
            else {
                this.air_density = this.atmosphere.return_basic_density(h, this.planet_name);
            }

            this.k = this.calculate_k();
            let velocityLengthSq = this.velocity.clone().lengthSq();
            let FdragMagnitude = this.k * velocityLengthSq;
            let Fdrag = this.velocity.clone().normalize().multiplyScalar(-1 * FdragMagnitude);
            // con/d/sxog("k: ", this.k);
            let overall_accel = FgravityVector.add(Fdrag);
            // console.log(overall_accel);
            // console.log(this.mass);
            // console.log(overall_accel.length());
            overall_accel.multiplyScalar(1/this.mass);
            
            // console.log(overall_accel);
            // console.log("Overall accel: ", overall_accel);
            this.velocity.add(overall_accel.clone().multiplyScalar(dt));
            // console.log('velocity length', this.velocity.length());
            // console.log(this.position);
            this.position.add(this.velocity.clone().multiplyScalar(dt/1000));
            // console.log(this.position);
            // console.log(this.position);
            // console.log("position ", this.position);
    
            // console.log("velocity: ", this.velocity);

            if (data){//skip the next step
                continue;
            }
            else{
                this.sphere.position.set(this.position.x + this.planet_initial_pos.x, this.position.y + this.planet_initial_pos.y, this.position.z + this.planet_initial_pos.z);
                points.push(new THREE.Vector3(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z));
            } 

        }
        if (data){
            return [this.position, -1]
        }
        console.log(this.position.clone());
        let line_geometry = new THREE.BufferGeometry().setFromPoints( points );
        let line = new THREE.Line( line_geometry, this.lineMaterial);
        return line;
        // calculate gravity


    }

    calculate_k(){
        return (0.5 * this.drag_coefficient * this.air_density * this.cross_sectional_area);
    }


    applyRotation(){
        let launch_angle = deg2rad(this.launch_angle)
        const arbitraryVector = new THREE.Vector3(0, -1, 0);
        const perpendicular_vector = new THREE.Vector3().crossVectors(this.velocity, arbitraryVector);
        const doubleperpendicularVector = new THREE.Vector3().crossVectors(perpendicular_vector, this.velocity);
        if (doubleperpendicularVector.y < 0){
            doubleperpendicularVector.multiplyScalar(-1);
        }
        this.velocity.applyAxisAngle(perpendicular_vector.clone().normalize(), -(Math.PI/2 - launch_angle));
        let launch_directionRad = deg2rad(this.launch_direction);
        // let vectorToEarth = this.position.clone().add(-this.earth_initial_pos)
        this.velocity.applyAxisAngle(this.position.clone().normalize(), launch_directionRad);

        this.arrowHelper1 = new THREE.ArrowHelper(this.velocity.clone().normalize(), this.sphere.position, EARTH_RADIUS, LINE_COLOUR);
        this.arrowHelper2 = new THREE.ArrowHelper(perpendicular_vector.clone().normalize(), this.sphere.position, EARTH_RADIUS, LINE_COLOUR);
        this.arrowHelper3 = new THREE.ArrowHelper(doubleperpendicularVector.clone().normalize(), this.sphere.position, EARTH_RADIUS, LINE_COLOUR);



    }

    align_with_planet(){
        const vecAdd = this.position.clone().normalize()
        while (this.position.length() <= this.planet_radius){
            this.position.add(vecAdd);
        }
    }


    iterate_once(first=false, planetPos){
        const dt = this.timestep

        if (first){
            console.log("first")
            this.onground = false;
            // this.position.add(planetpos);
            // console.log(this.position);
        }
        if (this.onground){
            return
        }
    
        let Fgravity = (this.planet_mass * GRAVITATIONAL_CONSTANT * this.mass) / (this.position.clone().multiplyScalar(10**3).lengthSq());
        // console.log("mass ", this.mass);
        // console.log("?/////////////////////////");
        let FgravityVector = this.position.clone().normalize().multiplyScalar(-1 * Fgravity);

        if (this.position.length() < this.planet_radius){
            FgravityVector.multiplyScalar(0);
            // this.velocity.clamp(new THREE.Vector3(0, 0, 0), this.position.clone().multiplyScalar(1000));
            this.velocity.multiplyScalar(0);
            this.onground = true;
            return
        }

        if (this.planet_radius == EARTH_RADIUS){
            let h = this.position.length() - EARTH_RADIUS;
            if (h < 0) h = 0;
            this.air_density = this.atmosphere.return_density(h);
        }
        else {
            this.air_density = 0.0;
        }

        this.k = this.calculate_k();
        let velocityLengthSq = this.velocity.clone().lengthSq();
        let FdragMagnitude = this.k * velocityLengthSq;
        let Fdrag = this.velocity.clone().normalize().multiplyScalar(-1 * FdragMagnitude);
        // con/d/sxog("k: ", this.k);
        // Fdrag=new THREE.Vector3(0, 0, 0);    
        let overall_accel = FgravityVector.add(Fdrag);
        // console.log(overall_accel);
        // console.log(this.mass);
        // console.log(overall_accel.length());
        overall_accel.multiplyScalar(1/this.mass);

        
        // console.log(overall_accel);
        // console.log("Overall accel: ", overall_accel);
        this.velocity.add(overall_accel.clone().multiplyScalar(dt));
        // console.log('velocity length', this.velocity.length());
        // console.log(this.position);
        this.position.add(this.velocity.clone().multiplyScalar(dt/1000));
        // console.log(this.position);
        // console.log(this.position);
        // console.log("position ", this.position);

        // console.log("velocity: ", this.velocity);
        this.sphere.position.set(this.position.x + planetPos.x, this.position.y + planetPos.y, this.position.z + planetPos.z);
    }

}

