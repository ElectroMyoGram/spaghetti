import * as THREE from 'three';
import { Atmosphere } from './atmosphere.js'


export class Projectile{
    constructor(x, y, z){
        //defines some class constants


        this.launch_speed = 500;
        this.mass = 1000;  
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

        this.velocity = this.initial_velocity.clone();
        console.log(this.position, this.velocity);
        this.arrowHelper1;
        this.arrowHelper2;
        this.arrowHelper3;
        this.applyRotation();
        this.align_with_earth();
        this.acceleration = new THREE.Vector3(0, 0, 0);

        this.radius = 90

        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        this.material_colour = new THREE.MeshBasicMaterial({color: 0x00ff00})
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        this.sphere.name = 'projectile' 
        this.sphere.position.set(this.position.x, this.position.y, this.position.z);

        this.timestep = 0.1;
        this.numIterations = 1000;
        

        this.lineMaterial = new THREE.LineBasicMaterial({
            color: 0x00ff00,
            opacity: 0.8,
            transparent: true
        });
        

        
    }

    calculate_initial_velocity(){
        return this.initial_position.clone().normalize().multiplyScalar(this.launch_speed);
    }
    reset(scene) {
        // scene.remove(this.arrowHelper1);
        // scene.remove(this.arrowHelper2);
        // scene.remove(this.arrowHelper3);
        this.initial_velocity = this.calculate_initial_velocity();

        this.position.copy(this.initial_position);
        this.velocity.copy(this.initial_velocity);
        this.applyRotation();
        this.align_with_earth();
    }

    iterate(data=false){
        const dt = this.timestep
        let points = [];

        let onground = true;

        for (let i = 0; i < this.numIterations; ++i){
            let Fgravity = (EARTH_MASS * GRAVITATIONAL_CONSTANT * this.mass) / (this.position.clone().multiplyScalar(10**3).lengthSq());
            // console.log("FGravity: ", Fgravity);
            // console.log("gravitational magnitude: ", this.gravitational_magnitude);
            // console.log("mass ", this.mass);
            // console.log("position_length_squared: ", this.position.lengthSq())
            // console.log("?/////////////////////////");
            let FgravityVector = this.position.clone().normalize().multiplyScalar(-1 * Fgravity);

            if (this.position.length() < EARTH_RADIUS){
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
            // console.log(FgravityVector);
    
            let h = this.position.length() - EARTH_RADIUS;
            if (h < 0) h = 0;
            this.air_density = this.atmosphere.return_density(h);
            this.k = this.calculate_k();
            let velocityLengthSq = this.velocity.clone().lengthSq();
            let FdragMagnitude = this.k * velocityLengthSq;
            let Fdrag = this.velocity.clone().normalize().multiplyScalar(-1 * FdragMagnitude);
            // con/d/sxog("k: ", this.k);
            // console.log("velocity: ", this.velocity); 
            Fdrag=new THREE.Vector3(0, 0, 0);    
            let overall_accel = FgravityVector.add(Fdrag);
            // console.log(overall_accel);
            // console.log(this.mass);
            // console.log(overall_accel.length());
            overall_accel.multiplyScalar(1/this.mass);
            // console.log(overall_accel.length());

            
            // console.log(overall_accel);
            // console.log("Overall accel: ", overall_accel);
            this.velocity.add(overall_accel.clone().multiplyScalar(dt));
            // console.log('velocity length', this.velocity.length());
            // console.log(this.position);
            this.position.add(this.velocity.clone().multiplyScalar(dt));
            // console.log(this.position);
            this.position.add(overall_accel.clone().multiplyScalar(0.5 * dt**2));
            // console.log(this.position);
            // console.log("position ", this.position);
    
            // console.log("velocity: ", this.velocity);

            if (data){//skip the next step
                continue;
            }
            else{
                this.sphere.position.set(this.position.x, this.position.y, this.position.z);
                points.push(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
            } 

        }
        if (data){
            return [this.position, this.numIterations]
        }
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
        this.velocity.applyAxisAngle(this.position.clone().normalize(), launch_directionRad);


        // this.arrowHelper1 = new THREE.ArrowHelper(this.velocity.clone().normalize(), this.position, EARTH_RADIUS, LINE_COLOUR);
        // this.arrowHelper2 = new THREE.ArrowHelper(perpendicular_vector.clone().normalize(), this.position, EARTH_RADIUS, LINE_COLOUR);
        // this.arrowHelper3 = new THREE.ArrowHelper(doubleperpendicularVector.clone().normalize(), this.position, EARTH_RADIUS, LINE_COLOUR);



    }

    align_with_earth(){
        const vecAdd = this.position.clone().normalize()
        while (this.position.length() <= EARTH_RADIUS){
            
            this.position.add(vecAdd);
        }
    }

}

