import * as THREE from 'three';
export class CelestialBody {
    constructor(texture_path, mass, radius, body_name, a=null, period=null, ecc=null, b=null){
        this.mass = mass * EARTH_MASS;
        if (a){
            this.orbit_a = a * AU;
            this.orbital_eccentricity = ecc;
            this.orbital_radius = radius(0, this.orbit_a, ecc);
            this.position = new THREE.Vector3(this.radius, 0, 0);
            this.beta = deg2rad(b);
            this.angle = 0;
            this.time_period = period * 365 * 24 * 3600;
        }



        this.radius = radius * EARTH_RADIUS;
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 64, 32);
        this.sphereTexture = new THREE.TextureLoader().load(texture_path);
        this.material = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material);
        this.sphere.name = body_name

        this.sprite_material = new THREE.SpriteMaterial({
            color: 0xffff00, 
            sizeAttenuation: false
        });
        this.sprite = new THREE.Sprite(this.sprite_material);
        this.sprite.scale.set(0.05, 0.05, 1.0);
    }
    
    calculate_radius(theta, a, e){
        return (a * ( 1- (e**2))) / (1 - e * Math.cos(theta))
    }


    iterate(dt){
        this.angle += (dt / this.period) * Math.PI * 2;
        this.orbital_radius = this.calculate_radius(this.angle, planetary_data.earth.aAU * AU, planetary_data.earth.ecc)
        let x = this.orbital_radius * Math.cos(this.angle)
        let z = this.orbital_radius * Math.sin(this.angle)
        let y = x * Math.sin(planetary_data.earth.beta)
        x = x * Math.cos(planetary_data.earth.beta)

        this.position = new THREE.Vector3(x, y, z)
        this.sphere.position.set(x, y, z);
        this.sprite.position.set(x, y, z);
    }
}