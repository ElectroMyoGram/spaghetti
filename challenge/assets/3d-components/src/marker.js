import * as THREE from 'three';
import {Projectile} from './projectile.js';


export class Marker{
    constructor(earth_pos){
        //defines some class constants
        // this.radius = 100
        // this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        // this.material_colour = new THREE.MeshBasicMaterial({color: 0xff0000})
        // this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        // this.sphere.name = 'marker' 
        this.sprite_map = new THREE.TextureLoader().load('/assets/textures/marker.jpg')
        this.sprite_material = new THREE.SpriteMaterial({
            color: 0xff0000, 
            depthTest: false,
            depthWrite: false
        });
        this.sprite = new THREE.Sprite(this.sprite_material);
        this.sprite.scale.set(100, 100, 1.0);
        this.sprite.name = 'marker'
        this.pr;

        this.latitude;
        this.longitude;
        this.earth_pos = earth_pos;
        
    }

    kill(scene){
        // this.spri.geometry.dispose();
        this.sprite.material.dispose();
        this.pr.sphere.geometry.dispose();
        this.pr.sphere.material.dispose();
        scene.remove(this.pr.arrowHelper1);
        scene.remove(this.pr.arrowHelper2);
        scene.remove(this.pr.arrowHelper3);
        scene.remove(this.pr.sphere);
        scene.remove(this.sprite);
    }

    create_projectile(){
        this.pr = new Projectile(this.sprite.position.x - this.earth_pos.x, this.sprite.position.y - this.earth_pos.y, this.sprite.position.z - this.earth_pos.z, this.earth_pos);
    }

    calculate_long_lat(earth_rot){
        console.log('earth pos', this.earth_pos);
        let vectorToEarth = new THREE.Vector3(this.sprite.position.x - this.earth_pos.x, this.sprite.position.y, this.sprite.position.z);
        console.log('vectortorEarth', vectorToEarth);
        this.latitude = rad2deg(convert_to_latitude(vectorToEarth.y, vectorToEarth.length()));
        this.longitude = rad2deg(convert_to_longitude(vectorToEarth.x, vectorToEarth.z, earth_rot));
    }

    set_pos(latitude, longitude, earth_rot){
        let y = convert_to_y(latitude, EARTH_RADIUS);
        let xz = convert_to_xz(longitude, latitude, earth_rot, EARTH_RADIUS);
        this.sprite.position.set(xz[0] + this.earth_pos.x, y, xz[1]);
        this.pr.initial_position = new THREE.Vector3(xz[0], y, xz[1]);
        // console.log(this.sprite.position);
        // console.log(latitude, longitude);
    }

}

