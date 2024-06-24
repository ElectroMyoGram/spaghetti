import * as THREE from 'three';


export class Marker{
    constructor(posVector){
        //defines some class constants
        this.radius = 0.03
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 8, 4);
        this.material_colour = new THREE.MeshBasicMaterial({color: 0xff0000})
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.material_colour);
        this.sphere.name = 'marker'        
    }

    kill(scene){
        this.sphere.geometry.dispose();
        this.sphere.material.dispose();
        scene.remove(this.sphere);
    }

}

