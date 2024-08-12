import * as THREE from 'three';
export class CelestialBody {
    constructor(texture_path, mass, radius, body_name, a=null, period=null, ecc=null, b=null){
        this.mass = mass * EARTH_MASS;




        this.radius = radius * EARTH_RADIUS;
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 64, 32);
        this.sphereTexture = new THREE.TextureLoader().load(texture_path);
        this.material = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
        this.sphere.name = body_name

        this.sprite_material = new THREE.SpriteMaterial({
            color: PLANET_COLOURS[body_name], 
            sizeAttenuation: false
        });
        this.sprite = new THREE.Sprite(this.sprite_material);
        this.sprite.scale.set(0.02, 0.02, 1.0);


        if (a){
            this.orbit_a = a * AU;
            this.orbital_eccentricity = ecc;
            this.orbital_radius = this.calculate_radius(0, this.orbit_a, ecc);
            this.position = new THREE.Vector3(this.radius, 0, 0);
            this.beta = deg2rad(b);
            this.angle = 0;
            this.time_period = period * 365 * 24 * 3600;

            this.set_pos(radius * AU, 0, 0);
        }


        this.trailVertices = [];
        this.trailGeometry = new THREE.BufferGeometry().setFromPoints(this.trailVertices);
        this.trailMaterial = new THREE.LineBasicMaterial({color : 0xffffff});
        this.trailLine = new THREE.Line(this.trailGeometry, this.trailMaterial)
        this.counter = 0;
    }
    
    calculate_radius(theta, a, e){
        return (a * ( 1- (e**2))) / (1 - e * Math.cos(theta))
    }

    set_pos(x, y, z){
        this.sphere.position.set(x, y, z);
        this.sprite.position.set(x, y, z);

    }

    iterate(dt){
        this.angle += (dt / this.time_period) * Math.PI * 2;
        this.orbital_radius = this.calculate_radius(this.angle, this.orbit_a, this.orbital_eccentricity)
        let x = this.orbital_radius * Math.cos(this.angle)
        let z = this.orbital_radius * Math.sin(this.angle)
        let y = x * Math.sin(this.beta)
        x = x * Math.cos(this.beta)
        this.set_pos(x, y, z);

        if (this.counter % 10 == 0){
            console.log("updating");
            this.update_trail_line();
        }
        this.counter += 1;
    }

    update_trail_line(){
        this.trailVertices.push(this.sphere.position.clone());
        this.trailGeometry.setFromPoints(this.trailVertices);

        if (this.trailVertices.length > 5000){
            this.trailVertices.shift()
        }
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
}