import * as THREE from 'three';


export class Moon{
    constructor(earthpos){
        //defines some class constants
        this.radius = MOON_RADIUS;
        this.sphereTexture = new THREE.TextureLoader().load('/assets/textures/moon.jpg');
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 64, 32);
        this.material = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
        this.sphere.name = 'moon';

        //material for the longitude/latitude lines
        this.rotation = 0;
        this.position = this.calculate_position(earthpos);
        this.velocity = new THREE.Vector3(-MOON_ORBIT_SPEED, 0, 0);
        this.mass = MOON_MASS;
        // this.earth_sphere.rotateZ(-deg2rad(EARTH_AXIS_OF_ROTATION));
        
        this.trailVertices = [];
        this.trailGeometry = new THREE.BufferGeometry().setFromPoints(this.trailVertices);
        this.trailMaterial = new THREE.LineBasicMaterial({color : 0xffffff});
        this.trailLine = new THREE.Line(this.trailGeometry, this.trailMaterial)
        this.counter = 0;

        this.earthpos
        
    }

    calculate_position(earthpos){
        // let moonPosition = new THREE.Vector3(0, Math.sin(deg2rad(MOON_ORBITAL_AXIS)) * MOON_ORBITAL_RADIUS, Math.cos(deg2rad(MOON_ORBITAL_AXIS)) * MOON_ORBITAL_RADIUS).add(earthpos)
        let moonPosition = new THREE.Vector3(0, 0, MOON_ORBITAL_RADIUS);

        this.sphere.position.set(moonPosition.x + earthpos.x, moonPosition.y + earthpos.y, moonPosition.z + earthpos.z);
        return moonPosition;
    }


    check_mouse_intersection(mousex, mousey, window, camera){
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        pointer.x = (mousex / window.innerWidth) * 2 -1;
        pointer.y = - (mousey / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera( pointer, camera );
        let intersects = raycaster.intersectObject( this.sphere );
        if (intersects.length > 0){
            return intersects[0]
        }
        else{
            return null;
        }
    }


    iterate(dt, earthpos){
        if (this.counter == 0){
            this.position = this.calculate_position(earthpos);
        }
        let Fgravity = (EARTH_MASS * GRAVITATIONAL_CONSTANT * this.mass) / (this.position.lengthSq() * 1e6);
        // console.log("mass ", this.mass);
        // console.log("?/////////////////////////");
        let FgravityVector = this.position.clone().normalize().multiplyScalar(-1 * Fgravity);
  

        let overall_accel = FgravityVector.multiplyScalar(1/this.mass);

        
        // console.log(overall_accel);
        // console.log("Overall accel: ", overall_accel);
        this.velocity.add(overall_accel.clone().multiplyScalar(dt));
        // console.log('velocity length', this.velocity.length());
        // console.log(this.position);
        this.position.add(this.velocity.clone().multiplyScalar(dt / 1000));
        // console.log(this.position);
        this.sphere.position.set(this.position.x + earthpos.x, this.position.y + earthpos.y, this.position.z + earthpos.z);

        if (this.counter % 10 == 0){
            this.update_trail_line();
        }
        this.counter += 1;
    }


    update_trail_line(){
        this.trailVertices.push(this.sphere.position.clone());
        this.trailGeometry.setFromPoints(this.trailVertices);

        if (this.trailVertices.length > 1000){
            this.trailVertices.shift()
        }
    }
}

