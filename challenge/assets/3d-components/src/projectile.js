import * as THREE from 'three';


export class Projectile{
    constructor(x, y, z){
        //defines some class constants


        this.launch_speed = 500;
        this.mass = 1000;  
        this.launch_angle = Math.PI / 8;
        this.direction = 0;
        this.gravitational_magnitude = -9.8;

        this.drag_coefficient = 0.1;

        this.cross_sectional_area = 0.001;
        this.air_density = 1.0;

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

        this.radius = 100

        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        this.material_colour = new THREE.MeshBasicMaterial({color: 0x00ff00})
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        this.sphere.name = 'projectile' 
        this.sphere.position.set(this.position.x, this.position.y, this.position.z);

        this.timestep = 0.01;
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
        scene.remove(this.arrowHelper1);
        scene.remove(this.arrowHelper2);
        scene.remove(this.arrowHelper3);
        this.initial_velocity = this.calculate_initial_velocity();

        this.position.copy(this.initial_position);
        this.velocity.copy(this.initial_velocity);
        this.applyRotation();
        this.align_with_earth();
    }

    iterate(){
        const dt = this.timestep
        let points = [];

        for (let i = 0; i < this.numIterations; ++i){
            let Fgravity = (EARTH_MASS * GRAVITATIONAL_CONSTANT) / (this.position.clone().multiplyScalar(10**3).lengthSq());
            // console.log("FGravity: ", Fgravity);
            // console.log("gravitational magnitude: ", this.gravitational_magnitude);
            // console.log("mass ", this.mass);
            // console.log("position_length_squared: ", this.position.lengthSq())
            // console.log("?/////////////////////////");
            let FgravityVector = this.position.clone().multiplyScalar(-1 * Fgravity);
            if (this.position.length() < EARTH_RADIUS){
                FgravityVector.multiplyScalar(0);
                // this.velocity.clamp(new THREE.Vector3(0, 0, 0), this.position.clone().multiplyScalar(1000));
                this.velocity.multiplyScalar(0);
            }
    
    
            let Fdrag = this.velocity.clone().multiplyScalar(-1 * this.k * this.velocity.clone().multiplyScalar(10**3).lengthSq())
            // console.log("FDrag: ", Fdrag);
            // console.log("k: ", this.k);
            // console.log("velocity: ", this.velocity); 
            Fdrag=new THREE.Vector3(0, 0, 0);       
            let overall_accel = FgravityVector.add(Fdrag).multiplyScalar(1/this.mass);
            // console.log("Overall accel: ", overall_accel);
    
            this.position.add(this.velocity.clone().multiplyScalar(dt)).add(overall_accel.clone().multiplyScalar(-0.5 * dt**2));
            // console.log("position ", this.position);
    
            this.velocity.add(overall_accel.clone().multiplyScalar(dt));
            // console.log("velocity: ", this.velocity);
    
            this.sphere.position.set(this.position.x, this.position.y, this.position.z);
            points.push(new THREE.Vector3(this.position.x, this.position.y, this.position.z));
        }
        let line_geometry = new THREE.BufferGeometry().setFromPoints( points );
        let line = new THREE.Line( line_geometry, this.lineMaterial);
        return line;
        // calculate gravity


    }


    applyRotation(){
        const arbitraryVector = new THREE.Vector3(0, -1, 0);
        const perpendicular_vector = new THREE.Vector3().crossVectors(this.velocity, arbitraryVector);
        const doubleperpendicularVector = new THREE.Vector3().crossVectors(perpendicular_vector, this.velocity);
        if (doubleperpendicularVector.y < 0){
            doubleperpendicularVector.multiplyScalar(-1);
        }
        this.velocity.applyAxisAngle(perpendicular_vector.clone().normalize(), -(Math.PI/2 - this.launch_angle));
        this.arrowHelper1 = new THREE.ArrowHelper(this.velocity.clone().normalize(), this.position, EARTH_RADIUS, LINE_COLOUR);
        this.arrowHelper2 = new THREE.ArrowHelper(perpendicular_vector.clone().normalize(), this.position, EARTH_RADIUS, LINE_COLOUR);
        this.arrowHelper3 = new THREE.ArrowHelper(doubleperpendicularVector.clone().normalize(), this.position, EARTH_RADIUS, LINE_COLOUR);
    }

    align_with_earth(){
        const vecAdd = this.position.clone().normalize()
        while (this.position.length() <= EARTH_RADIUS){
            
            this.position.add(vecAdd);
        }
    }

}

