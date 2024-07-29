import * as THREE from 'three';


export class Moon{
    constructor(){
        //defines some class constants
        this.radius = MOON_RADIUS;
        this.sphereTexture = new THREE.TextureLoader().load('/assets/textures/moon.jpg');
        this.sphereGeometry = new THREE.SphereGeometry(this.radius, 64, 32);
        this.material = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.moon_sphere = new THREE.Mesh(this.sphereGeometry, this.material);
        this.moon_sphere.name = 'moon';

        //material for the longitude/latitude lines
        this.rotation = 0;

        // this.earth_sphere.rotateZ(-deg2rad(EARTH_AXIS_OF_ROTATION));

        
    }


    check_mouse_intersection(mousex, mousey, window, camera){
        const raycaster = new THREE.Raycaster();
        const pointer = new THREE.Vector2();
        pointer.x = (mousex / window.innerWidth) * 2 -1;
        pointer.y = - (mousey / window.innerHeight) * 2 + 1;
        
        raycaster.setFromCamera( pointer, camera );
        let intersects = raycaster.intersectObject( this.moon_sphere );
        if (intersects.length > 0){
            return intersects[0]
        }
        else{
            return null;
        }
    }

}

