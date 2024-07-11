import * as THREE from 'three';
import {Projectile} from './projectile.js';


export class Marker{
    constructor(posVector){
        //defines some class constants
        this.radius = 100
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        this.material_colour = new THREE.MeshBasicMaterial({color: 0xff0000})
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        this.sphere.name = 'marker' 
        this.pr;

        this.latitude;
        this.longitude;
        
    }

    kill(scene){
        this.sphere.geometry.dispose();
        this.sphere.material.dispose();
        this.pr.sphere.geometry.dispose();
        this.pr.sphere.material.dispose();
        scene.remove(this.pr.arrowHelper1);
        scene.remove(this.pr.arrowHelper2);
        scene.remove(this.pr.arrowHelper3);
        scene.remove(this.pr.sphere);
        scene.remove(this.sphere);
    }

    create_projectile(){
        this.pr = new Projectile(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);
    }

    calculate_long_lat(earth_rot){
        this.latitude = rad2deg(convert_to_latitude(this.sphere.position.y, this.sphere.position.length()));
        this.longitude = rad2deg(convert_to_longitude(this.sphere.position.x, this.sphere.position.z, earth_rot));
    }

}

