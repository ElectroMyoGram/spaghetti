import * as THREE from 'three';


export class Projectile{
    constructor(x, y, z){
        //defines some class constants

        this.position = new THREE.Vector3(x, y, z);

        this.initial_velocity = 500;
        this.mass = 1000;  
        this.launch_angle = Math.PI / 2;
        this.direction = 0;
        this.gravitational_magnitude = -9.8;

        this.drag_coefficient = 0.1;
        this.cross_sectional_area = 0.001;
        this.air_density = 1.0;

        this.k = (0.5 * this.drag_coefficient * this.air_density * this.cross_sectional_area);

        this.velocity = this.position.clone().normalize().multiplyScalar(this.initial_velocity);
        console.log("velocity: ", this.velocity);
  
        this.acceleration = new THREE.Vector3(0, 0, 0);

        this.radius = 100

        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        this.material_colour = new THREE.MeshBasicMaterial({color: 0x00ff00})
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        this.sphere.name = 'projectile' 
        this.sphere.position.set(this.position.x, this.position.y, this.position.z);

        

        
    }

    iterate(dt=0.05){
        
        // calculate gravity
        let Fgravity = (EARTH_MASS * GRAVITATIONAL_CONSTANT) / (this.position.clone().multiplyScalar(10**3).lengthSq());
        // console.log("FGravity: ", Fgravity);
        // console.log("gravitational magnitude: ", this.gravitational_magnitude);
        // console.log("mass ", this.mass);
        // console.log("position_length_squared: ", this.position.lengthSq())
        // console.log("?/////////////////////////");
        let FgravityVector = this.position.clone().multiplyScalar(-1 * Fgravity);
        if (this.position.length() < EARTH_RADIUS){
            console.log("yes")
            console.log(this.position.length())
            FgravityVector.multiplyScalar(0);
            this.velocity.clamp(new THREE.Vector3(0, 0, 0), this.position.clone().multiplyScalar(1000));
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
        console.log(this.position);

    }

}

